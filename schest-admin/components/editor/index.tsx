import { Divider, Dropdown } from 'antd';
import { CiViewTable } from 'react-icons/ci';
import { TbBold, TbItalic, TbUnderline, TbStrikethrough } from 'react-icons/tb';
import {
  CiTextAlignCenter,
  CiTextAlignLeft,
  CiTextAlignRight,
} from 'react-icons/ci';
import { LiaListOlSolid } from 'react-icons/lia';
import { LiaListSolid } from 'react-icons/lia';
import { CiImageOn } from 'react-icons/ci';
import { IoIosReturnLeft } from 'react-icons/io';
import { CiLink } from 'react-icons/ci';
import { LuHeading1, LuHeading2, LuHeading3 } from 'react-icons/lu';
import { RxDividerHorizontal } from 'react-icons/rx';

import {
  Editor,
  EditorContent,
  EditorProvider,
  useCurrentEditor,
  useEditor,
} from '@tiptap/react';
import Underline from '@tiptap/extension-underline';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import TextAlign from '@tiptap/extension-text-align';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import Heading from '@tiptap/extension-heading';
import { LiaParagraphSolid } from 'react-icons/lia';
import Link from '@tiptap/extension-link';
import HardBreak from '@tiptap/extension-hard-break';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import { CiYoutube } from 'react-icons/ci';
import Image from '@tiptap/extension-image';
import ImageResize from 'tiptap-extension-resize-image';
import Youtube from '@tiptap/extension-youtube';

import ModalComponent from '../modal';
import { Popups } from 'src/pages/Bid-Management/components/Popups';
import { useEffect, useRef, useState } from 'react';
import { UploadPicture } from './UploadPicture';
import { GetYoutubeURL } from './YoutubeURL';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const TOOLBAR_BTN = (isActive?: boolean) =>
  `flex items-center justify-center text-xl bg-transparent outline-none cursor-pointer hover:text-schestiPrimary font-normal text-[#77787B] ${
    isActive && 'text-schestiPrimary'
  }`;

function MenuBar({ editor }: { editor: Editor | null }) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [showYoutubeModal, setShowYoutubeModal] = useState(false);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center space-x-2 space-y-2 p-2 border border-gray-300 rounded-md bg-gray-50 shadow-sm">
      <ModalComponent open={showImageModal} setOpen={setShowImageModal}>
        <Popups title="Upload Photo" onClose={() => setShowImageModal(false)}>
          <UploadPicture
            onCancel={() => setShowImageModal(false)}
            onOk={(url) => {
              editor.chain().focus().setImage({ src: url }).run();
              setShowImageModal(false);
            }}
          />
        </Popups>
      </ModalComponent>

      {/* Youtube */}
      <GetYoutubeURL
        open={showYoutubeModal}
        setOpen={setShowYoutubeModal}
        onSuccess={(data) => {
          editor.commands.setYoutubeVideo({
            src: data.url,
            width: parseInt(data.width),
            height: parseInt(data.height),
          });
          setShowYoutubeModal(false);
        }}
      />

      <Divider type="vertical" />
      {/* Font And Color Palette */}
      <div className="flex">
        <input
          type="color"
          onInput={(event) =>
            editor
              .chain()
              .focus()
              .setColor((event.target as HTMLInputElement).value)
              .run()
          }
          value={editor.getAttributes('textStyle').color}
          data-testid="setColor"
        />
      </div>
      <Divider type="vertical" />

      {/* Bold, Italic, Underline, Line Through */}
      <div className="flex space-x-2">
        <button
          className={`${TOOLBAR_BTN(editor.isActive('bold'))}`}
          onClick={() => {
            editor.chain().focus().toggleBold().run();
          }}
          disabled={!editor.can().chain().focus().toggleBold().run()}
        >
          <TbBold />
        </button>
        <button
          className={`${TOOLBAR_BTN(editor.isActive('italic'))}`}
          onClick={() => {
            editor.chain().focus().toggleItalic().run();
          }}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
        >
          <TbItalic />
        </button>

        <button
          className={`${TOOLBAR_BTN(editor.isActive('strike'))}`}
          onClick={() => {
            editor.chain().focus().toggleStrike().run();
          }}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
        >
          <TbStrikethrough />
        </button>

        <button
          className={`${TOOLBAR_BTN(editor.isActive('underline'))}`}
          onClick={() => {
            editor.chain().focus().toggleUnderline().run();
          }}
        >
          <TbUnderline />
        </button>
      </div>

      <Divider type="vertical" />

      {/* Text Align */}
      <div className="flex space-x-2">
        <button
          className={TOOLBAR_BTN(editor.isActive({ textAlign: 'left' }))}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        >
          <CiTextAlignLeft />
        </button>
        <button
          className={TOOLBAR_BTN(editor.isActive({ textAlign: 'center' }))}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        >
          <CiTextAlignCenter />
        </button>
        <button
          className={TOOLBAR_BTN(editor.isActive({ textAlign: 'right' }))}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        >
          <CiTextAlignRight />
        </button>
      </div>

      <Divider type="vertical" />

      {/* List */}
      <div className="flex space-x-2">
        <button
          className={TOOLBAR_BTN(editor.isActive('bulletList'))}
          onClick={() => {
            editor.chain().focus().toggleBulletList().run();
          }}
        >
          <LiaListSolid />
        </button>
        <button
          className={TOOLBAR_BTN(editor.isActive('orderedList'))}
          onClick={() => {
            editor.chain().focus().toggleOrderedList().run();
          }}
        >
          <LiaListOlSolid />
        </button>
      </div>

      <Divider type="vertical" />
      {/* Table */}
      <Dropdown
        menu={{
          items: [
            {
              children: [
                {
                  key: 'table-insert',
                  label: 'Insert Table',
                  onClick: () =>
                    editor
                      .chain()
                      .focus()
                      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                      .run(),
                },
                {
                  key: 'table-delete',
                  label: 'Delete Table',
                  onClick: () => editor.chain().focus().deleteTable().run(),
                },
              ],
              key: 'table',
              label: 'Table',
            },
            {
              key: 'header',
              label: 'Header',
              children: [
                {
                  key: 'header-column-toggle',
                  label: 'Toggle Header Column',
                  onClick: () =>
                    editor.chain().focus().toggleHeaderColumn().run(),
                },
                {
                  key: 'header-row-toggle',
                  label: 'Toggle Header Row',
                  onClick: () => editor.chain().focus().toggleHeaderRow(),
                },
                {
                  key: 'header-cell-toggle',
                  label: 'Toggle Header Cell',
                  onClick: () => editor.chain().focus().toggleHeaderCell(),
                },
              ],
            },
            {
              key: 'row',
              label: 'Row',
              children: [
                {
                  key: 'row-above',
                  label: 'Insert Row Above',
                  onClick: () => editor.chain().focus().addRowBefore().run(),
                },
                {
                  key: 'row-below',
                  label: 'Insert Row Below',
                  onClick: () => editor.chain().focus().addRowAfter().run(),
                },
                {
                  key: 'row-delete',
                  label: 'Delete Row',
                  onClick: () => editor.chain().focus().deleteRow().run(),
                },
              ],
            },
            {
              key: 'column',
              label: 'Column',
              children: [
                {
                  key: 'column-left',
                  label: 'Insert Column Left',
                  onClick: () => editor.chain().focus().addColumnBefore().run(),
                },
                {
                  key: 'column-right',
                  label: 'Insert Column Right',
                  onClick: () => editor.chain().focus().addColumnAfter().run(),
                },
                {
                  key: 'column-delete',
                  label: 'Delete Column',
                  onClick: () => editor.chain().focus().deleteColumn().run(),
                },
              ],
            },
            {
              key: 'cell',
              label: 'Cell',
              children: [
                {
                  key: 'cell-merge',
                  label: 'Merge Cells',
                  onClick: () => editor.chain().focus().mergeCells().run(),
                },
                {
                  key: 'cell-split',
                  label: 'Split Cells',
                  onClick: () => editor.chain().focus().splitCell().run(),
                },
              ],
            },
          ],
        }}
      >
        <button className={TOOLBAR_BTN()}>
          <CiViewTable />
        </button>
      </Dropdown>

      <Divider type="vertical" />

      {/* Image Video and Link */}

      <div className="flex space-x-2">
        <button
          className={TOOLBAR_BTN()}
          onClick={() => setShowImageModal(true)}
        >
          <CiImageOn />
        </button>
        <button
          className={TOOLBAR_BTN()}
          onClick={() => setShowYoutubeModal(true)}
        >
          <CiYoutube />
        </button>
        <button
          className={TOOLBAR_BTN(editor.isActive('link'))}
          onClick={() => {
            const previousUrl = editor.getAttributes('link').href;
            const url = window.prompt('URL', previousUrl);

            // cancelled
            if (url === null) {
              return;
            }

            // empty
            if (url === '') {
              editor.chain().focus().extendMarkRange('link').unsetLink().run();

              return;
            }

            // update link
            editor
              .chain()
              .focus()
              .extendMarkRange('link')
              .setLink({ href: url })
              .run();
          }}
        >
          <CiLink />
        </button>
      </div>

      <Divider type="vertical" />

      {/* Heading */}
      <div className="flex space-x-2">
        <button
          className={TOOLBAR_BTN(editor.isActive('heading', { level: 1 }))}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <LuHeading1 />
        </button>
        <button
          className={TOOLBAR_BTN(editor.isActive('heading', { level: 2 }))}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <LuHeading2 />
        </button>
        <button
          className={TOOLBAR_BTN(editor.isActive('heading', { level: 3 }))}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <LuHeading3 />
        </button>

        <button
          className={TOOLBAR_BTN(editor.isActive('paragraph'))}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          <LiaParagraphSolid />
        </button>

        <button
          className={TOOLBAR_BTN()}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <RxDividerHorizontal />
        </button>

        <button
          className={TOOLBAR_BTN()}
          onClick={() => editor.chain().focus().setHardBreak().run()}
        >
          <IoIosReturnLeft />
        </button>
      </div>
    </div>
  );
}

const extensions = [
  Document,
  Paragraph,
  Text,
  TextStyle,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  Color,
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
  Heading.configure({
    levels: [1, 2, 3],
  }),
  Underline,
  Link.configure({
    openOnClick: false,
    autolink: true,
    defaultProtocol: 'https',
    protocols: ['http', 'https'],
  }),
  HorizontalRule,
  Image,
  ImageResize,
  Youtube.configure({
    nocookie: true,
    controls: false,
  }),
];

export function EditorComponent({ onChange, value }: Props) {
  const valueRendered = useRef(false);

  const editor = useEditor({
    extensions,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      // Check if there's a value to set and if it hasn't been set already
      if (value && !valueRendered.current) {
        // Set the editor content using the provided value
        editor?.commands?.setContent(value);

        // Update the flag to prevent setting the content multiple times
        valueRendered.current = true;
      }
    }
  }, [editor, value]);

  return (
    <div className="p-3 bg-white shadow rounded-md">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
