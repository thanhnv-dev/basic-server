// const auth = require('firebase-admin/auth');

// const getTokenFromReq = req => {
//   if (req?.headers) {
//     const authorizationHeader = req?.headers['authorization'];
//     // 'Bearer token'
//     if (authorizationHeader) {
//       const idToken = authorizationHeader.slice(7);
//       return idToken;
//     }
//   }
//   return null;
// };

// const verifyIdToken = async idToken => {
//   return await auth
//     .getAuth()
//     .verifyIdToken(idToken)
//     .then(decodedToken => decodedToken.uid)
//     .catch(e => false);
// };

// const getUser = async req => {
//   const idToken = getTokenFromReq(req);

//   const uid = await verifyIdToken(idToken);

//   try {
//     return await auth.getAuth().getUser(uid);
//   } catch (error) {
//     return null;
//   }
// };

// const authenFireToken = async (req, res, next) => {
//   const idToken = getTokenFromReq(req);
//   if (idToken) {
//     const resVerifyIdToken = await verifyIdToken(idToken);

//     if (!resVerifyIdToken) {
//       return res.status(401).send({msg: 'Unauthorized'});
//     }
//     next();
//   } else {
//     return res.status(403).send({msg: 'Forbidden'});
//   }
// };

// module.exports = {
//   verifyIdToken,
//   getUser,
//   authenFireToken,
//   getTokenFromReq,
// };
