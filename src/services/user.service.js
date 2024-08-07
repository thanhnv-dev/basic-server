const UserModel = require('../models/user.model.js');
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
    const email = findUserByIdResult.email;

    const {newToken, newRefreshToken} = JWToken.createTokens({email});

    const resUserData = findUserByIdResult.toObject();

    delete resUserData.createdAt;
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
      status: 400,
      res: {msg: 'User does not exist!'},
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
      res: {msg: 'Account information is incorrect!'},
    };
  }
};

const updateInfomation = async req => {
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
      res: {msg: 'Account information is incorrect!'},
    };
  }
};

const updateImage = async req => {
  const token = JWToken.getTokenFromRequest(req);

  const data = JWToken.decodedToken(token);
  const id = data?.payload?.id;

  const file = req?.file;
  console.log(file);

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
  updateInfomation,
};
