const CustomService = require('../services/custom.service.js');
const Log = require('../utils/log.js');

const log = async (req, res) => {
  const logResult = await CustomService.log(req);

  Log.request({
    req: req,
    msg: logResult?.res?.msg,
    code: logResult.status,
  });

  return res.status(logResult.status).json(logResult.res);
};

const getLog = async (req, res) => {
  // Get date parameters from query
  const { startDate, endDate } = req.query;
  
  // Get custom data from database
  const customDataResult = await CustomService.getAllCustoms(startDate, endDate);

  Log.request({
    req: req,
    msg: customDataResult?.res?.msg,
    code: customDataResult.status,
  });

  // Generate HTML table for custom data
  const generateCustomTable = customs => {
    if (!customs || customs.length === 0) {
      return '<div class="no-data">No data</div>';
    }

    // Group by sessionId (only group if sessionId exists and is not '-')
    const groupedData = {};
    const ungroupedData = [];
    
    customs.forEach(custom => {
      const sessionId = custom.sessionId;
      if (sessionId && sessionId !== '-' && sessionId.trim() !== '') {
        // Group records with valid sessionId
        if (!groupedData[sessionId]) {
          groupedData[sessionId] = [];
        }
        groupedData[sessionId].push(custom);
      } else {
        // Keep records without sessionId as individual rows
        ungroupedData.push(custom);
      }
    });

    let tableHTML = `
      <table class="custom-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>User ID</th>
            <th>Reason</th>
            <th>Device</th>
            <th>Device ID</th>
            <th>Version</th>
            <th>AD ID</th>
            <th>ENV</th>
            <th>Session ID</th>
          </tr>
        </thead>
        <tbody>
    `;

    let rowIndex = 0;
    
    // First, add grouped records
    Object.keys(groupedData).forEach(sessionId => {
      const sessionData = groupedData[sessionId];
      const firstRecord = sessionData[0]; // Use first record for common fields
      
      // Convert to Vietnam timezone (GMT+7)
      const date = new Date(firstRecord.createdAt);
      const formattedDate = date.toLocaleDateString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh"
      });
      const formattedTime = date.toLocaleTimeString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      // Combine all reasons sorted by time with numbering
      const reasonsWithTime = sessionData
        .map(record => {
          let reasons = [];
          // Add reasonList items if they exist (no index needed)
          if (record.reasonList && Array.isArray(record.reasonList) && record.reasonList.length > 0) {
            reasons.push(...record.reasonList);
          }
          // Add reason if it exists and is not empty (will add index later)
          if (record.reason && record.reason !== null && record.reason !== undefined && record.reason.trim() !== '' && record.reason !== 'N/A') {
            reasons.push({ type: 'reason', value: record.reason, createdAt: new Date(record.createdAt) });
          }
          return reasons;
        })
        .flat()
        .filter(item => item !== null);
      
      // Separate reasonList items and reason items
      let reasonListItems = [];
      let reasonItems = [];
      
      reasonsWithTime.forEach(item => {
        if (typeof item === 'string') {
          // This is from reasonList
          reasonListItems.push(item);
        } else if (item.type === 'reason') {
          // This is from reason field
          reasonItems.push(item);
        }
      });
      
      // Sort reason items by time and add index
      reasonItems.sort((a, b) => a.createdAt - b.createdAt);
      const indexedReasons = reasonItems.map((item, index) => `${index + 1}: ${item.value}`);
      
      // Combine all items
      const allItems = [...reasonListItems, ...indexedReasons];
      
      // Remove duplicates while preserving order
      const uniqueItems = [];
      allItems.forEach(item => {
        if (!uniqueItems.includes(item)) {
          uniqueItems.push(item);
        }
      });
      
      const combinedReasons = uniqueItems.length > 0 
        ? uniqueItems.join('<br>') 
        : 'N/A';
      
      tableHTML += `
        <tr class="${rowIndex % 2 === 0 ? 'even' : 'odd'}">
          <td>${formattedDate}</td>
          <td>${formattedTime}</td>
          <td>${firstRecord.userId || '-'}</td>
          <td class="reason-cell">${combinedReasons}</td>
          <td>${firstRecord.device || 'N/A'}</td>
          <td>${firstRecord.deviceId || '-'}</td>
          <td>${firstRecord.version || 'N/A'}</td>
          <td>${firstRecord.appId || 'N/A'}</td>
          <td>${(firstRecord.env || '-').toUpperCase()}</td>
          <td>${sessionId}</td>
        </tr>
      `;
      rowIndex++;
    });
    
    // Then, add ungrouped records as individual rows
    ungroupedData.forEach(custom => {
      // Convert to Vietnam timezone (GMT+7)
      const date = new Date(custom.createdAt);
      const formattedDate = date.toLocaleDateString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh"
      });
      const formattedTime = date.toLocaleTimeString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      
      // Get reasons for ungrouped record
      let ungroupedReasonListItems = [];
      let ungroupedReasonItems = [];
      
      if (custom.reasonList && Array.isArray(custom.reasonList) && custom.reasonList.length > 0) {
        ungroupedReasonListItems.push(...custom.reasonList);
      }
      if (custom.reason && custom.reason !== null && custom.reason !== undefined && custom.reason.trim() !== '' && custom.reason !== 'N/A') {
        ungroupedReasonItems.push(custom.reason);
      }
      
      // Add index only to reason items
      const indexedUngroupedReasons = ungroupedReasonItems.map((reason, index) => `${index + 1}: ${reason}`);
      
      // Combine all items
      const allUngroupedItems = [...ungroupedReasonListItems, ...indexedUngroupedReasons];
      
      const ungroupedCombinedReasons = allUngroupedItems.length > 0 
        ? allUngroupedItems.join('<br>') 
        : 'N/A';
      
      tableHTML += `
        <tr class="${rowIndex % 2 === 0 ? 'even' : 'odd'}">
          <td>${formattedDate}</td>
          <td>${formattedTime}</td>
          <td>${custom.userId || '-'}</td>
          <td class="reason-cell">${ungroupedCombinedReasons}</td>
          <td>${custom.device || 'N/A'}</td>
          <td>${custom.deviceId || '-'}</td>
          <td>${custom.version || 'N/A'}</td>
          <td>${custom.appId || 'N/A'}</td>
          <td>${(custom.env || '-').toUpperCase()}</td>
          <td>${custom.sessionId || '-'}</td>
        </tr>
      `;
      rowIndex++;
    });

    tableHTML += `
        </tbody>
      </table>
    `;

    return tableHTML;
  };

  // Return HTML instead of JSON
  const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Custom Data List</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 0;
        }
        
        .container {
            width: 100%;
            margin: 0;
            background: white;
            border-radius: 0;
            box-shadow: none;
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            font-weight: 300;
        }
        
        .header p {
            font-size: 1.1rem;
            opacity: 0.9;
        }
        
        .content {
            padding: 30px;
        }
        
        .table-container {
            width: 100%;
            overflow-x: auto;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            margin-bottom: 20px;
            scrollbar-width: thin;
            scrollbar-color: #4facfe #f0f0f0;
        }
        
        .table-container::-webkit-scrollbar {
            height: 8px;
        }
        
        .table-container::-webkit-scrollbar-track {
            background: #f0f0f0;
            border-radius: 4px;
        }
        
        .table-container::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            border-radius: 4px;
        }
        
        .table-container::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #3a9bfe 0%, #00e2fe 100%);
        }
        
        .custom-table {
            min-width: 1200px;
            border-collapse: collapse;
            background: white;
            border-radius: 10px;
            overflow: hidden;
        }
        
        .custom-table th {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 600;
            white-space: nowrap;
        }
        
        .custom-table td {
            padding: 12px 15px;
            border-bottom: 1px solid #eee;
            white-space: nowrap;
        }
        
        /* Column widths */
        .custom-table th:nth-child(1), .custom-table td:nth-child(1) { /* Date */
            min-width: 100px;
        }
        
        .custom-table th:nth-child(2), .custom-table td:nth-child(2) { /* Time */
            min-width: 100px;
        }
        
        .custom-table th:nth-child(3), .custom-table td:nth-child(3) { /* User ID */
            min-width: 120px;
        }
        
        .custom-table th:nth-child(4), .custom-table td:nth-child(4) { /* Reason */
            min-width: 200px;
            white-space: normal;
            word-wrap: break-word;
        }
        
        .custom-table th:nth-child(5), .custom-table td:nth-child(5) { /* Device */
            min-width: 100px;
        }
        
        .custom-table th:nth-child(6), .custom-table td:nth-child(6) { /* Device ID */
            min-width: 120px;
        }
        
        .custom-table th:nth-child(7), .custom-table td:nth-child(7) { /* Version */
            min-width: 80px;
        }
        
        .custom-table th:nth-child(8), .custom-table td:nth-child(8) { /* AD ID */
            min-width: 120px;
        }
        
        .custom-table th:nth-child(9), .custom-table td:nth-child(9) { /* ENV */
            min-width: 100px;
        }
        
        .custom-table th:nth-child(10), .custom-table td:nth-child(10) { /* Session ID */
            min-width: 120px;
        }
        
        .custom-table tr:hover {
            background: #f8f9fa;
        }
        
        .custom-table tr.even {
            background: #f8f9fa;
        }
        
        .custom-table tr.odd {
            background: white;
        }
        
        .no-data {
            text-align: center;
            padding: 40px;
            color: #666;
            font-size: 1.1rem;
        }
        

        
        .export-btn {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 600;
            transition: transform 0.2s ease;
        }
        
        .export-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        .timestamp {
            color: #6c757d;
            font-size: 0.9rem;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .filter-container {
            margin-bottom: 20px;
            display: flex;
            gap: 10px;
            align-items: center;
            flex-wrap: wrap;
        }
        
        .filter-label {
            font-weight: 600;
            color: #333;
        }
        
        .env-filter {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background: white;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.2s ease;
        }
        
        .env-filter:hover {
            background: #f8f9fa;
        }
        
        .env-filter.active {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            border-color: #4facfe;
        }
        
        .date-filter {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background: white;
            font-size: 0.9rem;
            transition: all 0.2s ease;
        }
        
        .date-filter:focus {
            outline: none;
            border-color: #4facfe;
            box-shadow: 0 0 0 2px rgba(79, 172, 254, 0.2);
        }
        
        .date-filter-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.9rem;
            font-weight: 600;
            transition: transform 0.2s ease;
        }
        
        .date-filter-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        }
        
        .reason-cell {
            line-height: 1.4;
            vertical-align: top;
        }
        
        .reason-cell br {
            margin-bottom: 4px;
        }
        
        @media (max-width: 768px) {
            .container {
                margin: 10px;
                border-radius: 10px;
            }
            
            .header {
                padding: 20px;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .content {
                padding: 20px;
            }
            
            .table-container {
                margin: 0 -20px 20px -20px;
                border-radius: 0;
            }
            
            .custom-table {
                font-size: 0.8rem;
                min-width: 800px;
            }
            
            .custom-table th,
            .custom-table td {
                padding: 8px;
            }
            
            .filter-container {
                flex-direction: column;
                align-items: stretch;
            }
            
            .filter-container > * {
                margin-bottom: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Custom Data List</h1>
            <p>LOG</p>
        </div>
        
        <div class="content">
            <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
                <button class="export-btn" onclick="exportCSV()">📊 Export CSV</button>
            </div>
            
            <div class="timestamp">
                Last update: ${new Date().toLocaleString('vi-VN', {
                  timeZone: 'Asia/Ho_Chi_Minh',
                })}
            </div>
            
            <div class="filter-container">
                <span class="filter-label">Filter by ENV:</span>
                <button class="env-filter active" data-env="all">ALL ENV</button>
                <button class="env-filter" data-env="production">PRODUCTION</button>
                <button class="env-filter" data-env="test">TEST</button>
                <button class="env-filter" data-env="staging">STAGING</button>
            </div>
            
            <div class="filter-container">
                <span class="filter-label">Filter by Date:</span>
                <input type="date" id="startDate" class="date-filter" placeholder="Start Date">
                <span>to</span>
                <input type="date" id="endDate" class="date-filter" placeholder="End Date">
                <button class="date-filter-btn" onclick="filterByDate()">Filter</button>
                <button class="date-filter-btn" onclick="clearDateFilter()">Clear</button>
            </div>
            
            <h3 style="margin-bottom: 15px; color: #333;">📋 Log list</h3>
            <div style="margin-bottom: 10px; color: #666; font-size: 0.9rem; text-align: center;">
                💡 Scroll horizontally to see all columns
            </div>
            <div class="table-container">
                ${generateCustomTable(customDataResult.res.data)}
            </div>
        </div>
    </div>
    
    <script>
        // Add search functionality
        document.addEventListener('DOMContentLoaded', function() {
            // Add search input
            const searchHTML = '<input type="text" id="searchInput" placeholder="🔍 Search..." style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 5px; font-size: 1rem;">';
            document.querySelector('.content').insertAdjacentHTML('afterbegin', searchHTML);
            
            const searchInput = document.getElementById('searchInput');
            const table = document.querySelector('.custom-table');
            
            // ENV filter functionality
            const envFilters = document.querySelectorAll('.env-filter');
            let currentEnvFilter = 'all';
            
            envFilters.forEach(filter => {
                filter.addEventListener('click', function() {
                    // Remove active class from all filters
                    envFilters.forEach(f => f.classList.remove('active'));
                    // Add active class to clicked filter
                    this.classList.add('active');
                    currentEnvFilter = this.getAttribute('data-env');
                    
                    filterTable();
                });
            });
            
            function filterTable() {
                const rows = table.querySelectorAll('tbody tr');
                const searchTerm = searchInput.value.toLowerCase();
                
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    const envCell = row.querySelector('td:nth-child(9)'); // ENV column (now at position 9)
                    const envValue = envCell ? envCell.textContent.toLowerCase() : '';
                    
                    let showBySearch = text.includes(searchTerm);
                    let showByEnv = currentEnvFilter === 'all' || envValue === currentEnvFilter;
                    
                    row.style.display = (showBySearch && showByEnv) ? '' : 'none';
                });
            }
            
            // Date filter functionality
            window.filterByDate = function() {
                const startDate = document.getElementById('startDate').value;
                const endDate = document.getElementById('endDate').value;
                
                // Reload page with date parameters
                const url = new URL(window.location);
                
                if (startDate) {
                    url.searchParams.set('startDate', startDate);
                } else {
                    url.searchParams.delete('startDate');
                }
                
                if (endDate) {
                    url.searchParams.set('endDate', endDate);
                } else {
                    url.searchParams.delete('endDate');
                }
                
                window.location.href = url.toString();
            };
            
            window.clearDateFilter = function() {
                // Clear date inputs
                document.getElementById('startDate').value = '';
                document.getElementById('endDate').value = '';
                
                // Reload page without date parameters
                const url = new URL(window.location);
                url.searchParams.delete('startDate');
                url.searchParams.delete('endDate');
                window.location.href = url.toString();
            };
            
            // Set date inputs from URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            const startDateParam = urlParams.get('startDate');
            const endDateParam = urlParams.get('endDate');
            
            if (startDateParam) {
                document.getElementById('startDate').value = startDateParam;
            }
            if (endDateParam) {
                document.getElementById('endDate').value = endDateParam;
            }
            
            searchInput.addEventListener('keyup', function() {
                filterTable();
            });
            
            // Export CSV functionality
            window.exportCSV = function() {
                const startDate = document.getElementById('startDate')?.value;
                const endDate = document.getElementById('endDate')?.value;
                
                let url = '/custom/export-csv';
                const params = new URLSearchParams();
                
                if (startDate) {
                    params.append('startDate', startDate);
                }
                if (endDate) {
                    params.append('endDate', endDate);
                }
                
                if (params.toString()) {
                    url += '?' + params.toString();
                }
                
                // Create a temporary link to download the file
                const link = document.createElement('a');
                link.href = url;
                link.download = '';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };
        });
    </script>
</body>
</html>`;

  return res.status(200).send(html);
};

const exportLogCSV = async (req, res) => {
  // Get date parameters from query
  const { startDate, endDate } = req.query;
  
  // Export CSV data
  const csvResult = await CustomService.exportToCSV(startDate, endDate);

  Log.request({
    req: req,
    msg: csvResult?.res?.msg,
    code: csvResult.status,
  });

  if (csvResult.status === 200) {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${csvResult.res.fileName}"`);
    return res.status(200).send(csvResult.res.csvContent);
  } else {
    return res.status(csvResult.status).json(csvResult.res);
  }
};

module.exports = {
  log,
  getLog,
  exportLogCSV,
};
