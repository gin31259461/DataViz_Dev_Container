SELECT
  O.OID,
  O.[Type],
  O.CName,
  O.EName,
  M.Account,
  M.PWD,
  M.Email,
  M.Phone,
  M.Address,
  M.Birthday,
  M.Valid,
  M.LastLoginDT,
  M.LoginErrCount,
  M.LoginCount,
  M.VerifyCode,
  O.nClick,
  O.Since,
  M.SendEmailok,
  O.LastModifiedDT
FROM
  Object AS O,
  Member AS M
WHERE
  M.MID = O.OID;