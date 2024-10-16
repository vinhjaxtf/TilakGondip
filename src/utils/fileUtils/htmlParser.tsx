import { isTitle } from "./titleUtil";

class HtmlParser {
  bookDoc: any;
  contentList: HTMLElement[];
  contentTitleList: any[];
  content: string[];
  format: string;
  constructor(bookDoc: any, format: string, content: string[]) {
    this.bookDoc = bookDoc;
    this.contentList = [];
    this.contentTitleList = [];
    this.content = content;
    this.format = format;

    this.getContent(bookDoc);
  }
  getContent(bookDoc: HTMLElement) {
    this.contentList = Array.from(
      bookDoc.querySelectorAll("h1,h2,h3,h4,h5,b,font")
    );
    if (this.content.length > 0) {
      this.contentList = this.contentList.filter(
        (item) => this.content.indexOf(item.innerText) > -1
      );
    } else if (this.format !== "TXT") {
      let contents = this.contentList.filter((item: any, index: number) => {
        return isTitle(item.innerText.trim());
      }) as any;
      if (contents.length > 3) {
        this.contentList = contents;
      }
    }

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
  }

  getAnchoredDoc() {
    return this.bookDoc;
  }
  getContentList() {
    return this.contentTitleList.filter((item, index) => {
      if (index > 0) {
        return item.label !== this.contentTitleList[index - 1].label;
      } else {
        return true;
      }
    });
  }
  getChapterList() {
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
  getChapter(bookStr: string, contentList: any) {
    if (contentList.length === 0) return [bookStr];
    let chapterDoc: string[] = [];
    let chapterStr = "";

    for (let i = 0; i < contentList.length; i++) {
      if (!bookStr) return;
      chapterStr = bookStr.split(contentList[i].id)[0];
      bookStr =
        chapterStr.substring(chapterStr.lastIndexOf("<")) +
        contentList[i].id +
        bookStr.split(contentList[i].id)[1];

      chapterDoc.push(chapterStr.substring(0, chapterStr.lastIndexOf("<")));
      if (i === contentList.length - 1) {
        chapterDoc.push(bookStr);
      }
    }
    return chapterDoc;
  }
}

export default HtmlParser;
