export const NESGames = [
    {
        name: "热血足球2（热血联盟足球）",
        url: '/roms/hotblood-football2.nes'
    },
];


export function loadBinary(path: string, callback: (error: any, data?: any) => void, handleProgress: (progress: Number) => void) {
    var req = new XMLHttpRequest();
    req.open("GET", path);
    req.overrideMimeType("text/plain; charset=x-user-defined");
    req.onload = function() {
      if (this.status === 200) {
        if (req.responseText.match(/^<!doctype html>/i)) {
          // Got HTML back, so it is probably falling back to index.html due to 404
          return callback(new Error("Page not found"));
        }
  
        callback(null, this.responseText);
      } else if (this.status === 0) {
        // Aborted, so ignore error
      } else {
        callback(new Error(req.statusText));
      }
    };
    req.onerror = function() {
      callback(new Error(req.statusText));
    };

    const progressHandler = (ev: ProgressEvent) => {
        handleProgress(ev.loaded / ev.total);
    };
    req.onprogress = progressHandler;
    req.send();
    return req;
  }