const NotificaionModel = require('../models/notification.model.js');
const JWToken = require('../middleware/JWToken.js');
const admin = require('firebase-admin');

const findAll = async user_id => {
  const result = await NotificaionModel.find({
    user_id: user_id,
  });

  return result;
};

const fakeInitNotis = id => {
  const count = 9;
  for (let index = 1; index < count; index++) {
    initNotis(id, `0${index}`);
  }
  const count2 = 20;
  for (let index = 10; index < count2; index++) {
    initNotis(id, `${index}`);
  }
};

const initNotis = async (id, date) => {
  const discountNoti = new NotificaionModel({
    user_id: id,
    title: 'Discount Code',
    description:
      "Congratulations! The discount code 'SAVE20' has been successfully applied. You saved 20% on this order. Your new total is $80. Enjoy your meal!",
    unread: true,
    type: 'Discount',
    createdAt: new Date(`2024-08-${date}T09:00:00.00Z`),
    updatedAt: new Date(`2024-08-${date}:00:00.00Z`),
  });
  const offerNoti = new NotificaionModel({
    user_id: id,
    title: 'Special Offer',
    description:
      "Today only! Get 20% off your next order with the code 'SAVE20'. Order now to take advantage of this offer!",
    unread: true,
    type: 'Offer',
    createdAt: new Date(`2024-08-${date}T19:00:00.00Z`),
    updatedAt: new Date(`2024-08-${date}T19:00:00.00Z`),
  });
  const deliveringNoti = new NotificaionModel({
    user_id: id,
    title: 'Driver on the Way',
    description:
      "Today only! Get 20% off your next order with the code 'SAVE20'. Order now to take advantage of this offer!",
    unread: true,
    type: 'Delivering',
    createdAt: new Date(`2024-08-${date}T07:00:00.00Z`),
    updatedAt: new Date(`2024-08-${date}T07:00:00.00Z`),
  });
  const deliveredNoti = new NotificaionModel({
    user_id: id,
    title: 'Order Delivered',
    description:
      'Your order has arrived! Please check and enjoy your meal. Thank you for using our service!',
    unread: true,
    type: 'Delivered',
    createdAt: new Date(`2024-08-${date}T16:00:00.00Z`),
    updatedAt: new Date(`2024-08-${date}T16:00:00.00Z`),
  });

  await discountNoti.save();
  await offerNoti.save();
  await deliveringNoti.save();
  await deliveredNoti.save();
};

const fakeNotis = async (id, todaysNotifications) => {
  const now = new Date();
  const nowLocal = new Date();
  nowLocal.setHours(now.getHours(), 0, 0, 0);

  const nineAM = new Date();
  nineAM.setHours(9, 0, 0, 0);
  const twelvePM = new Date();
  twelvePM.setHours(12, 0, 0, 0);
  const threePM = new Date();
  threePM.setHours(15, 0, 0, 0);
  const eightPM = new Date();
  eightPM.setHours(20, 0, 0, 0);
  const hasPassedNineAM = nowLocal >= nineAM;
  const hasPassedTwelvePM = nowLocal >= twelvePM;
  const hasPassedThreePM = nowLocal >= threePM;
  const hasPassedEightPM = nowLocal >= eightPM;
  const notiLength = todaysNotifications?.length;

  switch (notiLength) {
    case 0:
      if (hasPassedNineAM) {
        const newDate = new Date(
          Date.UTC(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            9,
            0,
            0,
            0,
          ),
        );
        const discountNoti = new NotificaionModel({
          user_id: id,
          title: 'Discount Code',
          description:
            "Congratulations! The discount code 'SAVE20' has been successfully applied. You saved 20% on this order. Your new total is $80. Enjoy your meal!",
          unread: true,
          type: 'Discount',
          createdAt: newDate,
          updatedAt: newDate,
        });
        await discountNoti.save();
      }
      break;
    case 1:
      if (hasPassedTwelvePM) {
        const newDate = new Date(
          Date.UTC(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            12,
            0,
            0,
            0,
          ),
        );
        const offerNoti = new NotificaionModel({
          user_id: id,
          title: 'Special Offer',
          description:
            "Today only! Get 20% off your next order with the code 'SAVE20'. Order now to take advantage of this offer!",
          unread: true,
          type: 'Offer',
          createdAt: newDate,
          updatedAt: newDate,
        });
        await offerNoti.save();
      }
      break;
    case 2:
      if (hasPassedThreePM) {
        const newDate = new Date(
          Date.UTC(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            15,
            0,
            0,
            0,
          ),
        );
        const deliveringNoti = new NotificaionModel({
          user_id: id,
          title: 'Driver on the Way',
          description:
            "Today only! Get 20% off your next order with the code 'SAVE20'. Order now to take advantage of this offer!",
          unread: true,
          type: 'Delivering',
          createdAt: newDate,
          updatedAt: newDate,
        });
        await deliveringNoti.save();
      }
      break;
    case 3:
      if (hasPassedEightPM) {
        const newDate = new Date(
          Date.UTC(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            20,
            0,
            0,
            0,
          ),
        );
        const deliveredNoti = new NotificaionModel({
          user_id: id,
          title: 'Order Delivered',
          description:
            'Your order has arrived! Please check and enjoy your meal. Thank you for using our service!',
          unread: true,
          type: 'Delivered',
          createdAt: newDate,
          updatedAt: newDate,
        });
        await deliveredNoti.save();
      }
      break;
    default:
      break;
  }
};

const getNotis = async req => {
  const {offset = 0, limit = 10} = req.query;
  const token = JWToken.getTokenFromRequest(req);
  const data = JWToken.decodedToken(token);
  const id = data?.payload?.id;
  const findAllResult = await findAll(id);

  if (findAllResult) {
    if (findAllResult.length === 0) {
      fakeInitNotis(id);
    }
    const now = new Date();
    const todayStart = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );
    const todayEnd = new Date(todayStart);
    todayEnd.setUTCDate(todayEnd.getUTCDate() + 1);

    const todaysNotifications = findAllResult.filter(noti => {
      const createdAt = new Date(noti?.createdAt);
      return createdAt >= todayStart && createdAt < todayEnd;
    });
    if (todaysNotifications?.length < 4) {
      fakeNotis(id, todaysNotifications);
    }

    const res = {
      results: {
        total: findAllResult?.length,
        unread_count: findAllResult?.filter(e => e?.unread === true)?.length,
        offset: parseInt(offset, 10),
        limit: parseInt(limit, 10),
        notifications: findAllResult?.splice(offset, limit),
      },
      msg: 'Get notificaions Successfully!',
    };
    return {status: 200, res};
  }
};

const readNoti = async req => {
  const {noti_id} = req.body;
  try {
    const findNoti = await NotificaionModel.findById(noti_id);
    console.log('findNoti', findNoti);
    const updateNotiRes = await NotificaionModel.updateOne(
      {
        _id: noti_id,
      },
      {unread: false},
    );
    if (updateNotiRes.acknowledged) {
      return {
        status: 200,
        res: {
          msg: 'Read notificaion successfully!',
        },
      };
    } else {
      return {
        status: 400,
        res: {
          msg: 'Something went wrong!',
        },
      };
    }
  } catch (error) {
    return {
      status: 400,
      res: {
        msg: 'Notification not found!',
      },
    };
  }
};

module.exports = {
  getNotis,
  readNoti,
};
