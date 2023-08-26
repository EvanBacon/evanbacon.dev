import React from "react";

import { ProfileCard } from "./Profile";

function removeExtension(value: string) {
  return value.replace(/\.[^/.]+$/, "");
}

export function Gist({ url }: { url: string }) {
  const gist = removeExtension(url.match(/gist\.github\.com\/(.*)/)[1]);
  return <ReactEmbedGist gist={gist} />;
}
export function GitHubRepo({ url }: { url: string }) {
  return <span>GitHub repo Embed not implemented: {url}</span>;
}

const BIOS = {
  evanbacon: `Building 𝝠 Expo • Follow me on Twitter for updates 🥓`,
};
export function GitHubProfile({ url }: { url: string }) {
  const username = url.match(/github\.com\/(.*)/)?.[1].toLowerCase();
  const picture = url + ".png";
  const bio = BIOS[username] || "No bio available";
  return (
    <ProfileCard
      title={username}
      image={picture}
      subtitle={bio}
      website="GitHub"
      url={url}
    />
  );
}

function ReactEmbedGist({
  gist,
  file,
  ...props
}: {
  gist: string;
  file?: string;
  [key: string]: any;
}) {
  const [state, setState] = React.useReducer((s, a) => ({ ...s, ...a }), {
    loading: true,
    title: "",
    content: "",
    error: null,
  });

  const setupCallback = React.useCallback((id: string) => {
    window[`gist_callback_${id}`] = function (gist) {
      /*
       * Once we call this callback, we are going to set description of gist as title and fill the content. We are
       * also going to set loading flag into false to render the content
       */
      console.log("gist", gist);

      if (gist.error) {
        setState({
          title: null,
          content: null,
          loading: false,
          error: `${gist} failed to load`,
        });
      } else {
        setState({
          title: gist.description,
          content: gist.div.replace(/href=/g, 'target="_blank" href='),
          loading: false,
          error: null,
        });
      }

      /*
       * Not perfect way to do things, ideally parent component would have state of all loaded stylesheets
       * and add them as needed, but because I want to keep this as module and you can call more than once
       * this component, the only easy way for now is to check if the head already has this stylesheet inside
       *
       * NOTE: document.styleSheets doesn't work here, since stylesheet will be added there only once it is
       *       fully loaded, which means that if you have this component twice or more in a row there is high
       *       chance it will not recognize this stylesheet as already added. Hence this solution with checking
       *       innerHMTL to be sure that we don't have any css loaded twice
       */
      if (document.head.innerHTML.includes(gist.stylesheet)) {
        let stylesheet = document.createElement("link");
        stylesheet.type = "text/css";
        stylesheet.rel = "stylesheet";
        stylesheet.href = gist.stylesheet;
        stylesheet.id = `gist-stylesheet-${id}`;
        document.head.appendChild(stylesheet);
      }
    };
  }, []);

  /*
   * Load gist from github and attach callback to be executed once this script finishes loading
   * The callbacks are going to be named as gist_callback_:ID where ID is the hash of the gist
   */
  const id = React.useMemo(() => {
    const id = gist.split("/")[1];
    if (!id) {
      setState({
        title: null,
        content: null,
        loading: false,
        error: `${gist} is not valid format`,
      });
    } else {
      setupCallback(id);
    }
    return id;
  }, [gist]);

  const url = React.useMemo(() => {
    if (!id) {
      return null;
    }
    let url = `https://gist.github.com/${gist}.json?callback=gist_callback_${id}`;
    if (file) {
      url += `&file=${file}`;
    }
    return url;
  }, [id, gist, file]);

  React.useEffect(() => {
    if (!url) {
      return;
    }

    setState({ loading: true });
    console.log("url", url);

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.onerror = (e) => () => {
      setState({
        title: null,
        content: null,
        loading: false,
        error: `${url} failed to load`,
      });
    };

    document.head.appendChild(script);
  }, [url]);

  const { loadingClass, wrapperClass, titleClass, contentClass, errorClass } =
    props;

  console.log("state", state);
  if (state.loading) {
    return (
      <article className={loadingClass}>
        <p>Loading ...</p>
      </article>
    );
  }
  if (state.error) {
    return (
      <article className={errorClass}>
        <p>{state.error}</p>
      </article>
    );
  }

  console.log("set content");

  return (
    <article className={wrapperClass}>
      <h2 className={titleClass}>{state.title}</h2>
      <blockquote
        className={contentClass}
        dangerouslySetInnerHTML={{ __html: state.content }}
      />
    </article>
  );
}
