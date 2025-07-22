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
  // Get custom data from database
  const customDataResult = await CustomService.getAllCustoms();

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
            <th>Session ID</th>
            <th>Reason</th>
            <th>Device</th>
            <th>Version</th>
            <th>AD ID</th>
            <th>ENV</th>
            <th>Date</th>
            <th>Time</th>
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
        .map(record => ({
          reason: record.reason || 'N/A',
          createdAt: new Date(record.createdAt)
        }))
        .filter(item => item.reason !== 'N/A')
        .sort((a, b) => a.createdAt - b.createdAt); // Sort by time ascending
      
      const combinedReasons = reasonsWithTime.length > 0 
        ? reasonsWithTime.map((item, index) => `${index + 1}: ${item.reason}`).join('<br>') 
        : 'N/A';
      
      tableHTML += `
        <tr class="${rowIndex % 2 === 0 ? 'even' : 'odd'}">
          <td>${sessionId}</td>
          <td class="reason-cell">${combinedReasons}</td>
          <td>${firstRecord.device || 'N/A'}</td>
          <td>${firstRecord.version || 'N/A'}</td>
          <td>${firstRecord.appId || 'N/A'}</td>
          <td>${(firstRecord.env || '-').toUpperCase()}</td>
          <td>${formattedDate}</td>
          <td>${formattedTime}</td>
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
      
      tableHTML += `
        <tr class="${rowIndex % 2 === 0 ? 'even' : 'odd'}">
          <td>${custom.sessionId || '-'}</td>
          <td>${custom.reason || 'N/A'}</td>
          <td>${custom.device || 'N/A'}</td>
          <td>${custom.version || 'N/A'}</td>
          <td>${custom.appId || 'N/A'}</td>
          <td>${(custom.env || '-').toUpperCase()}</td>
          <td>${formattedDate}</td>
          <td>${formattedTime}</td>
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
        
        .custom-table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        
        .custom-table th {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 600;
        }
        
        .custom-table td {
            padding: 12px 15px;
            border-bottom: 1px solid #eee;
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
        
        .refresh-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 600;
            transition: transform 0.2s ease;
            margin-bottom: 20px;
        }
        
        .refresh-btn:hover {
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
            
            .custom-table {
                font-size: 0.8rem;
            }
            
            .custom-table th,
            .custom-table td {
                padding: 8px;
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
            <button class="refresh-btn" onclick="location.reload()">🔄 Refresh</button>
            
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
            
            <h3 style="margin-bottom: 15px; color: #333;">📋 Log list</h3>
            ${generateCustomTable(customDataResult.res.data)}
        </div>
    </div>
    
    <script>
        // Auto refresh every 60 seconds
        setTimeout(() => {
            location.reload();
        }, 60000);
        
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
                    const envCell = row.querySelector('td:nth-child(6)'); // ENV column
                    const envValue = envCell ? envCell.textContent.toLowerCase() : '';
                    
                    let showBySearch = text.includes(searchTerm);
                    let showByEnv = currentEnvFilter === 'all' || envValue === currentEnvFilter;
                    
                    row.style.display = (showBySearch && showByEnv) ? '' : 'none';
                });
            }
            
            searchInput.addEventListener('keyup', function() {
                filterTable();
            });
        });
    </script>
</body>
</html>`;

  return res.status(200).send(html);
};

module.exports = {
  log,
  getLog,
};
