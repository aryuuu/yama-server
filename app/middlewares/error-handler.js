module.exports = (err, req, res, next) => {
  try {
    if (err.httpStatus == null) {
      err.httpStatus = 500;
    }

    return res
      .status(err.httpStatus)
      .json({ 
        message: err.message
      });
  } catch (err) {
    next(err);
  }
}
