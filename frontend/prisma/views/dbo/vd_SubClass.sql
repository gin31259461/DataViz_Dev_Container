SELECT
  pc.CID AS 'cid',
  pc.CName AS 'pcname',
  cc.CID AS 'ccid',
  cc.CName AS 'ccname',
  cc.Type AS 'type',
  i.Rank AS 'rank'
FROM
  Class AS pc,
  Inheritance AS i,
  Class AS cc
WHERE
  pc.CID = i.PCID
  AND i.CCID = cc.CID;