SELECT
  o1.OID AS 'oid',
  o1.CName AS 'cname',
  o2.OID AS 'oid2',
  o2.CName AS 'cname2',
  r.Rank,
  r.Des
FROM
  Object AS o1,
  ORel AS r,
  Object AS o2
WHERE
  o1.OID = r.OID1
  AND r.OID2 = o2.OID;