const NotificaionService = require('../services/notification.service.js');
const Log = require('../utils/log.js');

const getNotis = async (req, res) => {
  const getNotisResult = await NotificaionService.getNotis(req);

  Log.request({
    req: req,
    msg: getNotisResult?.res?.msg,
    code: getNotisResult.status,
  });

  return res.status(getNotisResult.status).json(getNotisResult.res);
};
const readNoti = async (req, res) => {
  const readNotiResult = await NotificaionService.readNoti(req);

  Log.request({
    req: req,
    msg: readNotiResult?.res?.msg,
    code: readNotiResult.status,
  });

  return res.status(readNotiResult.status).json(readNotiResult.res);
};

module.exports = {
  getNotis,
  readNoti,
};
