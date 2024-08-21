const UserModel = require('../models/user.model.js');
const DeliveryaddressModel = require('../models/deliveryaddress.model.js');
const JWToken = require('../middleware/JWToken.js');
const admin = require('firebase-admin');
const {getFileName, getCurrentTimeUTC} = require('../utils/index.js');

const findUserByEmail = async email => {
  const result = await UserModel.findOne({
    email: email?.toLowerCase(),
  });

  return result;
};

const findUserById = async id => {
  try {
    const result = await UserModel.findById(id);
    return result;
  } catch (error) {
    return null;
  }
};

const profile = async req => {
  const token = JWToken.getTokenFromRequest(req);

  const data = JWToken.decodedToken(token);

  const id = data?.payload?.id;

  const findUserByIdResult = await findUserById(id);

  if (findUserByIdResult) {
    const {newToken, newRefreshToken} = JWToken.createTokens({
      id: findUserByIdResult.id,
    });

    const resUserData = findUserByIdResult.toObject();

    delete resUserData.createdAt;
    delete resUserData.address_default;
    delete resUserData.updatedAt;
    delete resUserData.password;

    const res = {
      results: {
        ...resUserData,
        token: newToken,
        refresh_token: newRefreshToken,
      },
      msg: 'Get profile Successfully!',
    };
    return {status: 200, res};
  } else {
    return {
      status: 403,
      res: {msg: 'Forbidden!'},
    };
  }
};

const updateDeliveryAddress = async req => {
  const token = JWToken.getTokenFromRequest(req);

  const data = JWToken.decodedToken(token);

  const id = data?.payload?.id;

  const findUserByIdResult = await findUserById(id);

  if (findUserByIdResult) {
    const {address_id, full_name, phone_number, address, is_default} = req.body;

    const newDeliveryaddress = await DeliveryaddressModel.updateMany(
      {
        _id: address_id,
      },
      {
        user_id: id,
        full_name: full_name,
        phone_number: phone_number,
        address: address,
        is_default: is_default,
      },
    );
    if (newDeliveryaddress.acknowledged) {
      if (is_default) {
        const updateAvatarRes = await UserModel.updateOne(
          {
            _id: id,
          },
          {
            address_default: address_id,
          },
        );

        if (updateAvatarRes.acknowledged) {
          return {
            status: 200,
            res: {
              msg: 'Update delivery address successfully!',
            },
          };
        }
        return {
          status: 400,
          res: {
            msg: 'Something went wrong!',
          },
        };
      } else {
        const updateAvatarRes = await UserModel.updateOne(
          {
            _id: id,
          },
          {
            address_default:
              findUserByIdResult?.address_default === address_id
                ? null
                : findUserByIdResult?.address_default,
          },
        );

        if (updateAvatarRes.acknowledged) {
          return {
            status: 200,
            res: {
              msg: 'Update delivery address successfully!',
            },
          };
        }
        return {
          status: 400,
          res: {
            msg: 'Something went wrong!',
          },
        };
      }
      return {
        status: 200,
        res: {
          msg: 'Update delivery address successfully!',
        },
      };
    }
    return {
      status: 400,
      res: {
        msg: 'Something went wrong!',
      },
    };
  } else {
    return {
      status: 403,
      res: {msg: 'Forbidden!'},
    };
  }
};

const getDeliveryAddressResult = async req => {
  const token = JWToken.getTokenFromRequest(req);

  const data = JWToken.decodedToken(token);

  const id = data?.payload?.id;

  const findUserByIdResult = await findUserById(id);

  if (findUserByIdResult) {
    const findAddress = await DeliveryaddressModel.find({
      user_id: id,
    });

    const address_default = findUserByIdResult?.address_default;

    const newData = [];

    findAddress.forEach(e => {
      const eObj = e.toObject();

      const currentData = {
        ...eObj,
        is_default: eObj?._id == address_default,
      };
      newData.push(currentData);
    });

    const res = {
      results: newData,
      msg: 'Get delivery address Successfully!',
    };
    return {status: 200, res};
  } else {
    return {
      status: 403,
      res: {msg: 'Forbidden!'},
    };
  }
};

const deleteUser = async req => {
  const token = JWToken.getTokenFromRequest(req);

  const data = JWToken.decodedToken(token);
  const id = data?.payload?.id;

  const findUserByIdResult = await findUserById(id);

  if (findUserByIdResult) {
    const deleteUserResult = await UserModel.deleteOne({
      _id: findUserByIdResult._id,
    });

    if (deleteUserResult.deletedCount) {
      const res = {
        msg: 'Account deleted successfully!',
      };
      return {status: 200, res};
    } else {
      return {
        status: 400,
        res: {msg: 'Something went wrong!'},
      };
    }
  } else {
    return {
      status: 400,
      res: {msg: 'Forbidden!'},
    };
  }
};

const deleteDeliveryAddress = async req => {
  const token = JWToken.getTokenFromRequest(req);

  const data = JWToken.decodedToken(token);
  const id = data?.payload?.id;

  const findUserByIdResult = await findUserById(id);

  const {address_id} = req.body;

  if (findUserByIdResult) {
    const deleteAddressResult = await DeliveryaddressModel.deleteOne({
      _id: address_id,
    });

    if (deleteAddressResult.acknowledged) {
      const res = {
        msg: 'Address deleted successfully!',
      };
      return {status: 200, res};
    } else {
      return {
        status: 400,
        res: {msg: 'Something went wrong!'},
      };
    }
  } else {
    return {
      status: 400,
      res: {msg: 'Forbidden!'},
    };
  }
};

const updateInfomations = async req => {
  const token = JWToken.getTokenFromRequest(req);

  const data = JWToken.decodedToken(token);

  const id = data?.payload?.id;

  const findUserByIdResult = await findUserById(id);

  if (findUserByIdResult) {
    const currenEmail = findUserByIdResult.email;
    const {user_name, email, date_of_birth, gender, phone_number} = req.body;

    if (!(gender === 'Male' || gender === 'Female')) {
      return {
        status: 400,
        res: {msg: '""gender" must be Male or Female'},
      };
    }
    const updateAvatarRes = await UserModel.updateMany(
      {
        _id: id,
      },
      {
        user_name: user_name,
        date_of_birth: date_of_birth,
        gender: gender,
        phone_number: phone_number,
        email: email,
        is_verified_email: email === currenEmail,
      },
    );

    if (updateAvatarRes.acknowledged) {
      const userDataNew = await findUserById(id);

      if (userDataNew) {
        const resDataUser = userDataNew.toObject();
        delete resDataUser.createdAt;
        delete resDataUser.updatedAt;
        delete resDataUser.address_default;
        delete resDataUser.password;

        return {
          status: 200,
          res: {
            results: resDataUser,
            msg: 'Update informations successfully!',
          },
        };
      }
    }

    return {status: 200, res};
  } else {
    return {
      status: 403,
      res: {msg: 'Forbidden!'},
    };
  }
};

const createDeliveryAddress = async req => {
  const token = JWToken.getTokenFromRequest(req);

  const data = JWToken.decodedToken(token);

  const id = data?.payload?.id;

  const findUserByIdResult = await findUserById(id);

  if (findUserByIdResult) {
    const {full_name, phone_number, address, is_default} = req.body;

    const newDeliveryaddress = new DeliveryaddressModel({
      user_id: id,
      full_name,
      phone_number,
      address,
    });
    await newDeliveryaddress.save();
    const findAddress = await DeliveryaddressModel.find({
      user_id: id,
    });
    if (
      findUserByIdResult?.address_default === null ||
      findUserByIdResult?.address_default === undefined ||
      is_default ||
      findAddress?.length === 1
    ) {
      const updateAvatarRes = await UserModel.updateOne(
        {
          _id: id,
        },
        {
          address_default: newDeliveryaddress?._id,
        },
      );

      if (updateAvatarRes.acknowledged) {
        return {
          status: 200,
          res: {
            msg: 'Add delivery address successfully!',
          },
        };
      }

      return {
        status: 400,
        res: {
          msg: 'Something went wrong!',
        },
      };
    }
    return {
      status: 200,
      res: {
        msg: 'Add delivery address successfully!',
      },
    };
  } else {
    return {
      status: 403,
      res: {msg: 'Forbidden!'},
    };
  }
};

const updateImage = async req => {
  const token = JWToken.getTokenFromRequest(req);

  const data = JWToken.decodedToken(token);
  const id = data?.payload?.id;

  const file = req?.file;

  if (file === undefined) {
    return {
      status: 400,
      res: {msg: 'No file found!'},
    };
  }
  if (
    !(
      file?.mimetype === 'image/png' ||
      file?.mimetype === 'image/jpeg' ||
      file?.mimetype === 'image/svg+xml' ||
      file?.mimetype === 'image/webp'
    )
  ) {
    return {
      status: 400,
      res: {msg: 'File format is incorrect, only image files are accepted!'},
    };
  }

  const fileName = file?.originalname;

  const userData = await findUserById(id);

  if (!userData) {
    return {
      status: 400,
      res: {msg: 'Account does not exist!'},
    };
  }

  const bucket = admin.storage().bucket();

  if (userData.photo_url && userData.background_url) {
    const filePathOld = `user_images/${id}/${getFileName(userData.img_url)}`;

    await bucket
      .file(filePathOld)
      .delete()
      .catch(_ => {
        console.error('Error deleting old file');
      });
  }

  const currentDate = getCurrentTimeUTC();
  const filePath = `user_images/${id}/${currentDate}_${fileName}`;

  const blob = bucket.file(filePath);

  const blobWriter = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  const finishPromise = new Promise((resolve, reject) => {
    blobWriter.on('error', _ => {
      reject(new Error('Something went wrong!'));
    });

    blobWriter.on('finish', async () => {
      resolve();
    });
  });

  blobWriter.end(file.buffer);

  try {
    await finishPromise;

    const downloadUrl = await blob.getSignedUrl({
      action: 'read',
      expires: '01-01-2100',
    });

    const updateAvatarRes = await UserModel.updateOne(
      {
        _id: id,
      },
      {img_url: downloadUrl[0]},
    );

    if (updateAvatarRes.acknowledged) {
      const userDataNew = await findUserById(id);

      if (userDataNew) {
        const resDataUser = userDataNew.toObject();
        delete resDataUser.createdAt;
        delete resDataUser.updatedAt;
        delete resDataUser.address_default;
        delete resDataUser.password;

        return {
          status: 200,
          res: {
            results: resDataUser,
            msg: 'Update image successfully!',
          },
        };
      }
    }

    return {
      status: 400,
      res: {msg: 'Something went wrong!'},
    };
  } catch (error) {
    return {
      status: 400,
      res: {msg: 'Something went wrong!'},
    };
  }
};

module.exports = {
  profile,
  deleteUser,
  updateImage,
  updateInfomations,
  createDeliveryAddress,
  getDeliveryAddressResult,
  updateDeliveryAddress,
  deleteDeliveryAddress,
};
