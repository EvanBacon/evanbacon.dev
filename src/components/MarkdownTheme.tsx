import { MDXComponents, MDXStyles } from "@bacons/mdx";
import React from "react";
import { Image } from "react-native";

import { useFont } from "./useFont";

export function MarkdownTheme({ children }: { children: React.ReactNode }) {
  return (
    <MDXStyles
      h1={{
        fontFamily: useFont("Inter_900Black"),
        fontSize: 32,
      }}
      h2={{
        fontFamily: useFont("Inter_900Black"),
        marginTop: 16,
        fontSize: 22,
        marginBottom: 0,
      }}
      code={{
        fontFamily: "SourceCodePro_400Regular",
        borderRadius: 2,
        backgroundColor: "#f2f2f2",
        padding: 20,
        fontSize: 16,
      }}
      inlineCode={{
        fontFamily: "SourceCodePro_400Regular",
        borderRadius: 2,
        fontSize: 15,
        backgroundColor: "#f2f2f2",
        paddingVertical: 2,
        paddingHorizontal: 4,
      }}
      p={{
        fontFamily: useFont("Inter_400Regular"),
        lineHeight: 30,
        fontSize: 20,
        marginBottom: 8,
      }}
      blockquote={{
        fontFamily: useFont("Inter_400Regular"),
        borderLeftWidth: 3,
        fontSize: 21,
        borderLeftColor: "#292929",
        paddingLeft: 23,
      }}
      img={{
        width: "100%",
        resizeMode: "contain",
        minWidth: "100%",
        maxWidth: "100%",
        minHeight: 180,
        maxHeight: 360,
      }}
      a={{
        fontFamily: useFont("Inter_400Regular"),
        textDecorationLine: "underline",
      }}
      li={{
        fontFamily: useFont("Inter_400Regular"),
        fontSize: 16,
        lineHeight: 30,
      }}
      hr={{
        paddingBottom: 10,
        marginBottom: 14,
        marginTop: 32,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 24,
      }}
    >
      <MDXComponents
        li={({ style, ...props }) => (
          <div style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <div
              style={{
                marginTop: 12,
                marginRight: 8,
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: "black",
              }}
            />
            <div style={{ flex: 1 }}>
              <span {...props} style={style} />
            </div>
          </div>
        )}
        hr={({ style }) => (
          <div style={style}>
            {["", "", ""].map((v, i) => (
              <div
                key={String(i)}
                style={{
                  marginRight: i !== 2 ? 20 : 0,
                  width: 3,
                  height: 3,
                  borderRadius: 1.5,
                  backgroundColor: "black",
                }}
              />
            ))}
          </div>
        )}
      >
        {children}
      </MDXComponents>
    </MDXStyles>
  );
}

function AutoHeightImage(props) {
  const [imgSize, setImageSize] = React.useState({});
  const [imageHeight, setImageHeight] = React.useState(100);

  React.useEffect(() => {
    Image.getSize(props.source.uri, (w, h) => {
      setImageSize({ width: w, height: h });
    });
  }, [props.source]);

  const [layoutWidth, setLayoutWidth] = React.useState(0);

  React.useEffect(() => {
    if (layoutWidth === 0) return;

    const ratio = imgSize.width / imgSize.height;
    const newHeight = layoutWidth / ratio;
    if (isNaN(newHeight)) return;
    setImageHeight(newHeight);
  }, [imgSize, layoutWidth]);

  return (
    <Image
      style={[props.style, { height: imageHeight }]}
      onLayout={(e) => {
        if (layoutWidth === e.nativeEvent.layout.width) return;
        setLayoutWidth(e.nativeEvent.layout.width);
      }}
      source={props.source}
    />
  );
}
