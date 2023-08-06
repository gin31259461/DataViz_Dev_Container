SELECT
  O.OID,
  O.[Type],
  O.CName,
  A.[FileName],
  C.Title AS MIMEType,
  O.nClick,
  A.Keywords,
  A.Lang,
  A.Indexable,
  A.IndexInfo,
  O.Since,
  O.LastModifiedDT
FROM
  Archive AS A,
  Object AS O,
  ContentType AS C
WHERE
  A.AID = O.OID
  AND A.ContentType = C.CTID;