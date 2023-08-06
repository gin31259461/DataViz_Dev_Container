SELECT
  C.CID AS [CID],
  C.[Type] AS [CType],
  C.CName AS [CCName],
  C.Field AS [Field],
  O.OID AS [OID],
  O.[Type] AS [Type],
  O.CName AS [OCName],
  O.CDes AS [OCDes]
FROM
  Pattern_Class AS C,
  Pattern_Object AS O,
  Pattern_CO AS CO
WHERE
  C.CID = CO.CID
  AND CO.OID = O.OID;