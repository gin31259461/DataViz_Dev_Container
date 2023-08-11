SELECT
  O.OID,
  O.[Type],
  O.CName,
  O.CDes,
  S.[Scheme],
  U.HostName,
  U.[Path],
  U.Title,
  U.Des AS URLDes,
  C.Title AS MIMEType,
  U.Keywords,
  U.Lang,
  U.Indexable,
  U.IndexInfo,
  O.nClick,
  O.Since,
  O.LastModifiedDT
FROM
  URL AS U,
  Object AS O,
  URLScheme AS S,
  ContentType AS C
WHERE
  O.OID = U.UID
  AND S.SID = U.[Scheme]
  AND C.CTID = U.ContentType;