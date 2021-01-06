const getFinancialYear = (date = new Date()) => {
  if ((date.getMonth() + 1) <= 3) {
    return date.getFullYear();
  } else {
    return date.getFullYear() + 1;
  }
};

exports.getFinancialYear = getFinancialYear;
