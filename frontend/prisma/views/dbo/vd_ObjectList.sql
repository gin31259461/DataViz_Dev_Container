SELECT
  c.CID AS 'cid',
  c.CName AS 'cname',
  o.OID AS 'oid',
  o.CName AS 'oname',
  o.Type AS 'type',
  r.Rank AS 'rank'
FROM
  Class AS c,
  CO AS r,
  Object AS o
WHERE
  c.CID = r.CID
  AND r.OID = o.OID;