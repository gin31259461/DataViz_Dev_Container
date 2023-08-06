SELECT
  U.CCName AS [Type],
  R.OCDes + U.OCName AS [Exp],
  U.Field AS [Field]
FROM
  vd_Patext_Class2Object AS R,
  vd_Patext_Class2Object AS U
WHERE
  R.CType = 2
  AND U.CType = 1
UNION
SELECT
  V.CCName AS [Type],
  V.OCDes AS [Exp],
  V.Field AS [Field]
FROM
  vd_Patext_Class2Object AS V
WHERE
  V.CType = 3;