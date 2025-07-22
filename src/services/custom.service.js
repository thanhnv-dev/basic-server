const CustomModel = require('../models/custom.model.js');

const log = async req => {
  const {reason, device, version, appId, sessionId, env} = req.body;

  const newCustom = new CustomModel({
    reason: reason,
    device: device,
    version: version,
    appId: appId,
    sessionId: sessionId,
    env: env,
  });

  const createCustomResult = await newCustom.save();

  if (createCustomResult == newCustom) {
    return {
      status: 200,
      res: {
        msg: 'Log Success!',
      },
    };
  }
};

const getAllCustoms = async () => {
  try {
    const customs = await CustomModel.find({}).sort({createdAt: -1});
    const totalCount = await CustomModel.countDocuments({});
    
    return {
      status: 200,
      res: {
        msg: 'Get customs success!',
        data: customs,
        totalCount: totalCount,
      },
    };
  } catch (error) {
    return {
      status: 500,
      res: {
        msg: 'Error getting customs data',
        error: error.message,
      },
    };
  }
};

const getCustomsByDate = async (startDate, endDate) => {
  try {
    const query = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const customs = await CustomModel.find(query).sort({createdAt: -1});
    const totalCount = await CustomModel.countDocuments(query);
    
    return {
      status: 200,
      res: {
        msg: 'Get customs by date success!',
        data: customs,
        totalCount: totalCount,
      },
    };
  } catch (error) {
    return {
      status: 500,
      res: {
        msg: 'Error getting customs data by date',
        error: error.message,
      },
    };
  }
};

const exportToCSV = async () => {
  try {
    const customs = await CustomModel.find({}).sort({createdAt: -1});
    
    // Helper function to escape CSV values
    const escapeCSV = (value) => {
      if (value === null || value === undefined) return '""';
      const stringValue = String(value);
      // Escape quotes by doubling them and wrap in quotes
      return `"${stringValue.replace(/"/g, '""')}"`;
    };
    
    // Group by sessionId (same logic as in controller)
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
    
    // Convert to CSV format
    const csvHeaders = [
      'Session ID',
      'Reason', 
      'Device',
      'Version',
      'AD ID',
      'ENV',
      'Date',
      'Time'
    ];
    
    const csvRows = [];
    
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
        ? reasonsWithTime.map((item, index) => `${index + 1}: ${item.reason}`).join('; ') 
        : 'N/A';
      
      csvRows.push([
        escapeCSV(sessionId),
        escapeCSV(combinedReasons),
        escapeCSV(firstRecord.device || 'N/A'),
        escapeCSV(firstRecord.version || 'N/A'),
        escapeCSV(firstRecord.appId || 'N/A'),
        escapeCSV((firstRecord.env || '-').toUpperCase()),
        escapeCSV(formattedDate),
        escapeCSV(formattedTime)
      ].join(','));
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
      
      csvRows.push([
        escapeCSV(custom.sessionId || '-'),
        escapeCSV(custom.reason || 'N/A'),
        escapeCSV(custom.device || 'N/A'),
        escapeCSV(custom.version || 'N/A'),
        escapeCSV(custom.appId || 'N/A'),
        escapeCSV((custom.env || '-').toUpperCase()),
        escapeCSV(formattedDate),
        escapeCSV(formattedTime)
      ].join(','));
    });
    
    const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');
    
    return {
      status: 200,
      res: {
        msg: 'Export CSV success!',
        csvContent: csvContent,
        fileName: `custom_data_${new Date().toISOString().split('T')[0]}.csv`
      },
    };
  } catch (error) {
    return {
      status: 500,
      res: {
        msg: 'Error exporting CSV',
        error: error.message,
      },
    };
  }
};

module.exports = {
  log,
  getAllCustoms,
  getCustomsByDate,
  exportToCSV,
};
