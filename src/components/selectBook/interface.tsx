import BookModel from "../../model/Book";
import NoteModel from "../../model/Note";
import BookmarkModel from "../../model/Bookmark";
import { RouteComponentProps } from "react-router";
export interface BookListProps extends RouteComponentProps<any> {
  books: BookModel[];
  isSelectBook: boolean;
  isCollapsed: boolean;
  selectedBooks: string[];
  handleAddDialog: (isShow: boolean) => void;
  handleMessageBox: (isShow: boolean) => void;
  handleMessage: (message: string) => void;

  handleDeleteDialog: (isShow: boolean) => void;
  handleSelectBook: (isSelectBook: boolean) => void;
  handleSelectedBooks: (selectedBooks: string[]) => void;
}
export interface BookListState {}
