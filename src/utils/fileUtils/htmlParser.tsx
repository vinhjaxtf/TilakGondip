import { isTitle } from "./titleUtil";

class HtmlParser {
  bookDoc: any;
  contentList: HTMLElement[];
  contentTitleList: any[];

  format: string;
  constructor(bookDoc: any, format: string) {
    this.bookDoc = bookDoc;
    this.contentList = [];
    this.contentTitleList = [];
    this.format = format;
  }
  getContent(bookDoc: HTMLElement) {
    this.contentList = Array.from(bookDoc.querySelectorAll("h1,h2,h3,h4,h5,b"));

    this.contentList = this.contentList.filter((item) =>
      isTitle(item.innerText.trim().replace(/(\r\n|\n|\r)/gm, ""))
    );

    for (let i = 0; i < this.contentList.length; i++) {
      let random = Math.floor(Math.random() * 900000) + 100000;
      this.contentTitleList.push({
        label: this.contentList[i].innerText,
        id: "title" + random,
        href: "#title" + random,
        subitems: [],
      });
    }
    for (let i = 0; i < this.contentList.length; i++) {
      this.contentList[i].id = this.contentTitleList[i].id;
    }
    return this.contentTitleList;
  }

  getAnchoredDoc() {
    return this.bookDoc;
  }
  getChapterTitleList() {
    return this.contentList
      .filter((item, index) => {
        if (index > 0) {
          return item.innerText !== this.contentList[index - 1].innerText;
        } else {
          return true;
        }
      })
      .map((item) => item.innerText);
  }
  getChapter(bookStr: string) {
    if (this.contentTitleList.length === 0) return [bookStr];
    let chapterList: string[] = [];
    let chapterStr = "";

    for (let i = 0; i < this.contentTitleList.length; i++) {
      if (!bookStr) return;
      chapterStr = bookStr.split(this.contentTitleList[i].id)[0];
      bookStr =
        chapterStr.substring(chapterStr.lastIndexOf("<")) +
        this.contentTitleList[i].id +
        bookStr.split(this.contentTitleList[i].id)[1];

      chapterStr.substring(0, chapterStr.lastIndexOf("<")) &&
        chapterList.push(chapterStr.substring(0, chapterStr.lastIndexOf("<")));
      if (i === this.contentTitleList.length - 1) {
        chapterList.push(bookStr);
      }
    }
    let chapterObj: { title: string; text: string }[] = [];
    for (let i = 0; i < chapterList.length; i++) {
      if (chapterList.length === this.contentTitleList.length) {
        chapterObj.push({
          title: this.contentTitleList[i].label,
          text: chapterList[i],
        });
      } else {
        if (i === 0) {
          chapterObj.push({ title: "Forword", text: chapterList[i] });
        } else {
          chapterObj.push({
            title: this.contentTitleList[i - 1].label,
            text: chapterList[i],
          });
        }
      }
    }
    return chapterObj;
  }
  getMobiChapter(bookStr: string) {
    let chapterList = bookStr.split("<mbp:pagebreak>");
    let chapterObj: { title: string; text: string }[] = [];
    for (let i = 0; i < chapterList.length; i++) {
      let chapterDoc = new DOMParser().parseFromString(
        chapterList[i],
        "text/html"
      );
      if (
        chapterDoc.body.innerText.trim() ||
        chapterDoc.getElementsByTagName("img").length > 0
      ) {
        chapterObj.push({
          title: chapterDoc.querySelectorAll("h1,h2,h3,h4,blockquote,font,b")[0]
            ? (chapterDoc.querySelectorAll(
                "h1,h2,h3,h4,blockquote,font,b"
              )[0] as HTMLElement).innerText
            : chapterDoc.body.innerText.substring(0, 10).trim()
            ? chapterDoc.body.innerText.substring(0, 10).trim()
            : "cover",
          text: chapterList[i],
        });
      }
    }
    return chapterObj;
  }
  getMobiContent(bookStr: string) {
    let contentList = bookStr.split("<mbp:pagebreak>");
    for (let i = 0; i < contentList.length; i++) {
      let chapterDoc = new DOMParser().parseFromString(
        contentList[i],
        "text/html"
      );
      if (
        chapterDoc.body.innerText.trim() ||
        chapterDoc.getElementsByTagName("img").length > 0
      ) {
        let random = Math.floor(Math.random() * 900000) + 100000;
        this.contentTitleList.push({
          label: chapterDoc.querySelectorAll("h1,h2,h3,h4,blockquote,font,b")[0]
            ? (chapterDoc.querySelectorAll(
                "h1,h2,h3,h4,blockquote,font,b"
              )[0] as HTMLElement).innerText
            : chapterDoc.body.innerText.substring(0, 10).trim()
            ? chapterDoc.body.innerText.substring(0, 10).trim()
            : "cover",
          id: "title" + random,
          href: "#title" + random,
          subitems: [],
        });
      }
    }
    return this.contentTitleList;
  }
  getContentList() {
    return this.contentTitleList;
  }
}

export default HtmlParser;
