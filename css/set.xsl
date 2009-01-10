<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.1" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:php="http://php.net/xsl"
>
  <xsl:output method="xml" indent="yes"/>
  <xsl:template match="/">
    <fo:root>
      <fo:layout-master-set>
        <fo:simple-page-master master-name="A5-portrait" page-height="21.0cm" page-width="14.8cm"  	
          margin="1cm">
          <fo:region-body/>
        </fo:simple-page-master>
      </fo:layout-master-set>
      <fo:page-sequence master-reference="A5-portrait">
        <fo:flow flow-name="xsl-region-body" font-size="11.5pt" font-family="Times New Roman" text-align="left">
          <fo:block font-size="15pt" font-family="Helvetica" text-align="center" padding-before="6pt" padding-after="3pt">
            <xsl:value-of select="set/@name"/>
          </fo:block>
          <fo:block>
            <fo:table table-layout="fixed" width="100%">
              <fo:table-column column-width="proportional-column-width(2)"/>
              <fo:table-column column-width="proportional-column-width(3)"/>
              <fo:table-body>
                <xsl:for-each select="set/slide_groups/*">
                  <fo:table-row keep-with-next="always">
                    <fo:table-cell>
                      <fo:block  text-align="left"  padding-right="13pt">
                        <xsl:value-of select="@name"/>
                      </fo:block>
                    </fo:table-cell>
                    <fo:table-cell>
                      <fo:block >
                        <xsl:value-of select="notes"/>
                      </fo:block>
                    </fo:table-cell>
                  </fo:table-row>
                </xsl:for-each>
              </fo:table-body>
            </fo:table>
          </fo:block>
          <fo:block id="terminator"/>
        </fo:flow>
      </fo:page-sequence>
    </fo:root>
  </xsl:template>
</xsl:stylesheet>
