<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
	
	<xsl:template match="/">
		<xsl:param name="cat" />
		<html>
			<style type="text/css">
				body {	font-size: 12pt; font-family: "Times New Roman", serif; text-align:justify; width:595px;}
        table {
          width:595px;
          border-width: 1px 1px 1px 1px;
          border-spacing: 0px;
          border-style: outset outset outset outset;
          border-color: black black black black;
          border-collapse: collapse;
          background-color: white;
        }
        table th {
          border-width: 1px 1px 1px 1px;
          padding: 1px 1px 1px 1px;
          border-style: inset inset inset inset;
          border-color: gray gray gray gray;
          background-color: white;
          -moz-border-radius: 0px 0px 0px 0px;
        }
        table td {
          border-width: 1px 1px 1px 1px;
          padding: 1px 1px 1px 1px;
          border-style: inset inset inset inset;
          border-color: gray gray gray gray;
          background-color: white;
          -moz-border-radius: 0px 0px 0px 0px;
        }
        h1 {	font-size: 16pt; font-family: Arial, sans-serif; text-align:center;}
				h2 {	font-size: 14pt; font-family: Arial, sans-serif; text-align:left;}
				ul { margin-left:-20px; }
			</style>
      
			<body>
        <table>
          <tr>
            <td colspan="2" align="center">
              <h1>
                <xsl:value-of select="set/@name"/>
              </h1>
            </td>
          </tr>
          <xsl:for-each select="set/slide_groups/*">
            <tr>
              <td align="left" width="40%">
                <xsl:value-of select="@name"/>
              </td>
              <td align="right">
                <xsl:value-of select="notes"/>
              </td>
            </tr>
          </xsl:for-each>
          </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>