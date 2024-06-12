import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  getAllNotes,
  newNote,
  findNotes,
  removeNote,
  removeAllNotes,
} from "./notes.js";

const listNotes = (notes) => {
  notes.forEach(({ id, content, tags }) => {
    console.log("\n");
    console.log("id: ", id);
    console.log("tags: ", tags.join(", ")), console.log("note: ", content);
  });
};

yargs(hideBin(process.argv))
  .command(
    "new <note>",
    "Creates a new note",
    (yargs) => {
      return yargs.positional("note", {
        type: "string",
        content: "Note contents",
      });
    },
    async ({ note, tags }) => {
      const tagArr = tags ? tags.split(",") : [];
      const addedNote = await newNote(note, tagArr);
      console.log("Note added: ", addedNote.id);
    }
  )
  .option("tags", {
    alias: "t",
    type: "string",
    description: "Adds tags to note",
  })
  .command(
    "all",
    "get all notes",
    () => {},
    async (argv) => {
      const notes = await getAllNotes();
      listNotes(notes);
    }
  )
  .command(
    "find <filter>",
    "get matching notes",
    (yargs) => {
      return yargs.positional("filter", {
        describe:
          "The search term to filter notes by, will be applied to note.content",
        type: "string",
      });
    },
    async (argv) => {
      const notes = await getAllNotes();
      const filteredNotes = await findNotes(argv.filter);
      listNotes(filteredNotes);
    }
  )
  .command(
    "remove <id>",
    "remove a note by id",
    (yargs) => {
      return yargs.positional("id", {
        type: "number",
        description: "The id of the note you want to remove",
      });
    },
    async (argv) => {
      const id = await removeNote(argv.id);
      console.log("Removed note:", id);
    }
  )
  .command(
    "web [port]",
    "launch website to see notes",
    (yargs) => {
      return yargs.positional("port", {
        describe: "port to bind on",
        default: 5000,
        type: "number",
      });
    },
    async (argv) => {}
  )
  .command(
    "clean",
    "remove all notes",
    () => {},
    async (argv) => {
      await removeAllNotes();
      console.log("Cleared all notes");
    }
  )
  .demandCommand(1)
  .parse();
