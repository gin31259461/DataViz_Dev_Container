SELECT
  O.OID AS id,
  O.CName AS title,
  O.EName AS subtitle,
  O.CDes AS description,
  CONVERT(VARCHAR, O.Since, 20) AS since,
  CONVERT(VARCHAR, O.LastModifiedDT, 20) AS lastModified,
  C.Type AS TYPE,
  C.StyleJSTR AS style
FROM
  OBJECT AS O,
  Chart AS C
WHERE
  O.Type = 7
  AND O.OID = C.CID;