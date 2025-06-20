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
  const generateCustomTable = (customs) => {
    if (!customs || customs.length === 0) {
      return '<div class="no-data">Không có dữ liệu</div>';
    }

    let tableHTML = `
      <table class="custom-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Reason</th>
            <th>Device</th>
            <th>Version</th>
            <th>App ID</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
    `;

    customs.forEach((custom, index) => {
      const createdAt = new Date(custom.createdAt).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      tableHTML += `
        <tr class="${index % 2 === 0 ? 'even' : 'odd'}">
          <td>${custom._id}</td>
          <td>${custom.reason || 'N/A'}</td>
          <td>${custom.device || 'N/A'}</td>
          <td>${custom.version || 'N/A'}</td>
          <td>${custom.appId || 'N/A'}</td>
          <td>${createdAt}</td>
        </tr>
      `;
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
            padding: 20px;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
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
                Last update: ${new Date().toLocaleString('vi-VN')}
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
            
            searchInput.addEventListener('keyup', function() {
                const searchTerm = this.value.toLowerCase();
                const rows = table.querySelectorAll('tbody tr');
                
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(searchTerm) ? '' : 'none';
                });
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
