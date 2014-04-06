<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.1" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:php="http://php.net/xsl">
  <xsl:output method="xml" indent="yes"/>
  <xsl:template match="/">
    <fo:root>
      <fo:layout-master-set>
        <fo:simple-page-master master-name="A4-portrait" page-height="29.6cm" page-width="21.0cm"  	
          margin="1cm">
          <fo:region-body/>
        </fo:simple-page-master>
      </fo:layout-master-set>
      <fo:page-sequence master-reference="A4-portrait">
        <fo:flow flow-name="xsl-region-body" font-size="9.5pt" font-family="Times New Roman" text-align="left">
          <fo:block font-size="13pt" font-family="Helvetica" text-align="center" padding-before="6pt" padding-after="3pt">
            <xsl:value-of select="set/@name"/>
          </fo:block>
          <fo:block>
            <fo:table table-layout="fixed" width="100%">
              <fo:table-column column-width="proportional-column-width(2)"/>
              <fo:table-column column-width="proportional-column-width(3)"/>
              <fo:table-body>
                <xsl:for-each select="set/slide_groups/slide_group">
                  <xsl:if test="./@type='song'">
                    <fo:table-row keep-with-next="always">
                      <fo:table-cell  border-style="solid">
                        <fo:block  text-align="left"  padding-right="13pt">
                          Song
                        </fo:block>
                      </fo:table-cell>
                      <fo:table-cell  border-style="solid">
                        <fo:block >
                          <xsl:value-of select="./@name"/> <xsl:value-of select="./@hymnnumber"/>
                        </fo:block>
                      </fo:table-cell>
                    </fo:table-row>
                  </xsl:if>
                  <xsl:if test="./@type!='song'">
                    <fo:table-row keep-with-next="always">
                      <fo:table-cell  border-style="solid">
                        <fo:block  text-align="left"  padding-right="13pt">
                          <xsl:value-of select="@name"/>
                        </fo:block>
                      </fo:table-cell>
                      <fo:table-cell border-style="solid">
                          <fo:block>
                            <xsl:value-of select="notes" />
                            <!--<xsl:value-of select="php:function('htmlentities', string(./notes))" />-->
                          </fo:block>
                      </fo:table-cell>
                    </fo:table-row>
                  </xsl:if>
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
