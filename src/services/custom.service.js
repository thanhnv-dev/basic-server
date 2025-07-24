const CustomModel = require('../models/custom.model.js');

const log = async req => {
  const {reason, device, version, appId, sessionId, env, reasonList, userId, deviceId} = req.body;

  const newCustom = new CustomModel({
    reason: reason,
    device: device,
    version: version,
    appId: appId,
    sessionId: sessionId,
    env: env,
    reasonList: reasonList,
    userId: userId,
    deviceId: deviceId,
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

const getAllCustoms = async (startDate, endDate) => {
  try {
    const query = {};
    
    if (startDate && endDate) {
      // Both dates selected - filter by range
      query.createdAt = {
        $gte: new Date(startDate + 'T00:00:00.000Z'),
        $lte: new Date(endDate + 'T23:59:59.999Z')
      };
    } else if (startDate) {
      // Only start date selected - filter by single day
      query.createdAt = {
        $gte: new Date(startDate + 'T00:00:00.000Z'),
        $lte: new Date(startDate + 'T23:59:59.999Z')
      };
    } else if (endDate) {
      // Only end date selected - filter by single day
      query.createdAt = {
        $gte: new Date(endDate + 'T00:00:00.000Z'),
        $lte: new Date(endDate + 'T23:59:59.999Z')
      };
    }
    
    const customs = await CustomModel.find(query).sort({createdAt: -1});
    const totalCount = await CustomModel.countDocuments(query);
    
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

const exportToCSV = async (startDate, endDate) => {
  try {
    const query = {};
    
    if (startDate && endDate) {
      // Both dates selected - filter by range
      query.createdAt = {
        $gte: new Date(startDate + 'T00:00:00.000Z'),
        $lte: new Date(endDate + 'T23:59:59.999Z')
      };
    } else if (startDate) {
      // Only start date selected - filter by single day
      query.createdAt = {
        $gte: new Date(startDate + 'T00:00:00.000Z'),
        $lte: new Date(startDate + 'T23:59:59.999Z')
      };
    } else if (endDate) {
      // Only end date selected - filter by single day
      query.createdAt = {
        $gte: new Date(endDate + 'T00:00:00.000Z'),
        $lte: new Date(endDate + 'T23:59:59.999Z')
      };
    }
    
    const customs = await CustomModel.find(query).sort({createdAt: -1});
    
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
      'Date',
      'Time',
      'User ID',
      'Reason', 
      'Device',
      'Device ID',
      'Version',
      'AD ID',
      'ENV',
      'Session ID'
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
      
      csvRows.push([
        escapeCSV(formattedDate),
        escapeCSV(formattedTime),
        escapeCSV(firstRecord.userId || '-'),
        escapeCSV(combinedReasons),
        escapeCSV(firstRecord.device || 'N/A'),
        escapeCSV(firstRecord.deviceId || '-'),
        escapeCSV(firstRecord.version || 'N/A'),
        escapeCSV(firstRecord.appId || 'N/A'),
        escapeCSV((firstRecord.env || '-').toUpperCase()),
        escapeCSV(sessionId)
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
      
      csvRows.push([
        escapeCSV(formattedDate),
        escapeCSV(formattedTime),
        escapeCSV(custom.userId || '-'),
        escapeCSV(ungroupedCombinedReasons),
        escapeCSV(custom.device || 'N/A'),
        escapeCSV(custom.deviceId || '-'),
        escapeCSV(custom.version || 'N/A'),
        escapeCSV(custom.appId || 'N/A'),
        escapeCSV((custom.env || '-').toUpperCase()),
        escapeCSV(custom.sessionId || '-')
      ].join(','));
    });
    
    const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');
    
    // Generate filename based on date filter
    let fileName = 'custom_data';
    if (startDate && endDate) {
      fileName += `_${startDate}_to_${endDate}`;
    } else if (startDate) {
      fileName += `_${startDate}`;
    } else if (endDate) {
      fileName += `_${endDate}`;
    } else {
      fileName += '_all';
    }
    fileName += `_${new Date().toISOString().split('T')[0]}.csv`;
    
    return {
      status: 200,
      res: {
        msg: 'Export CSV success!',
        csvContent: csvContent,
        fileName: fileName
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
