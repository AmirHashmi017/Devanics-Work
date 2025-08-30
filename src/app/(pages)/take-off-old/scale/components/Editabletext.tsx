import React, { useState, useRef, useEffect } from 'react';
import { Circle, Text, Transformer } from 'react-konva';
import { Html } from 'react-konva-utils';
import Konva from 'konva';
import { selectUser } from '@/redux/authSlices/auth.selector';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { KonvaEventObject } from 'konva/lib/Node';
// import { KonvaEventObject } from 'konva/lib/Node';

interface EditableTextProps {
  id: string;
  x: number;
  y: number;
  initialText: string;
  fontSize: number;
  textColor: string;
  rotation: number;
  selectedCategory?: any;
  selectedSubCategory?: any;
  ctrlPressed?: boolean;
  handleDelete: (text: any) => void;
  onChange: (newTextProps: {
    id: string;
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
    textUnit: number;
    rotation: number;
    category: string | any; //(selectedCategory && selectedCategory?.length > 0) ? selectedCategory : 'Length Measurement',
    subcategory: string | any;
    user: any;
    dateTime: any;
    projectName: string;
  }) => void;
}

const EditableText: React.FC<EditableTextProps> = ({
  id,
  x,
  y,
  initialText,
  fontSize,
  rotation,
  onChange,
  handleDelete,
  textColor,
  selectedCategory,
  selectedSubCategory,
  ctrlPressed,
}) => {
  const [text, setText] = useState<string>(initialText);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const textRef: any = useRef<Konva.Text>(null);
  const trRef: any = useRef<Konva.Transformer>(null);
  const inputRef: any = useRef<HTMLInputElement>(null);
  const { user } = useSelector(selectUser);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (trRef.current && textRef.current && !isEditing) {
      trRef.current.nodes([textRef.current]);
    }
  }, [isEditing]);

  const handleDblClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;
    // e.evt.stopPropagation()
    // e.evt.stopImmediatePropagation()
    if (textRef.current) {
      textRef.current.hide();
      trRef.current?.hide();
    }
    setIsEditing(true);
  };

  const handleTransformEnd = () => {
    if (textRef.current) {
      console.log(textRef.current, ' ===> current values of textRef');
      onChange({
        id,
        text,
        x: textRef.current.x(),
        y: textRef.current.y(),
        width: textRef.current.width() * textRef.current.scaleX(),
        height: textRef.current.height() * textRef.current.scaleY(),
        fontSize: textRef.current.fontSize() * textRef.current.scaleX(),
        textUnit: textRef.current.fontSize() * textRef.current.scaleX(),
        rotation: textRef.current.rotation(),
        category: selectedCategory ?? 'Text Measurement', //(selectedCategory && selectedCategory?.length > 0) ? selectedCategory : 'Length Measurement',
        subcategory: selectedSubCategory,
        user,
        dateTime: moment().toDate(),
        projectName: 'Text Measurement',
      });
      textRef.current.scaleX(1);
      textRef.current.scaleY(1);
    }
  };

  const handleDragEndTxt = (e: KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true;
    // e.evt.stopPropagation()
    // e.evt.stopImmediatePropagation()
    if (textRef.current) {
      onChange({
        id,
        text,
        x: textRef.current.x(),
        y: textRef.current.y(),
        width: textRef.current.width(),
        height: textRef.current.height(),
        fontSize: textRef.current.fontSize(),
        textUnit: textRef.current.fontSize(),
        rotation: textRef.current.rotation(),
        category: selectedCategory ?? 'Text Measurement', //(selectedCategory && selectedCategory?.length > 0) ? selectedCategory : 'Length Measurement',
        subcategory: selectedSubCategory,
        user,
        dateTime: moment().toDate(),
        projectName: 'Text Measurement',
      });
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (textRef.current) {
      textRef.current.show();
      trRef.current?.show();
    }
    onChange({
      id,
      text,
      x: textRef.current?.x() || 0,
      y: textRef.current?.y() || 0,
      width: textRef.current?.width() || 0,
      height: textRef.current?.height() || 0,
      fontSize: textRef.current?.fontSize() || 0,
      textUnit: textRef.current?.fontSize() || 0,
      rotation: textRef.current?.rotation() || 0,
      category: selectedCategory ?? 'Text Measurement', //(selectedCategory && selectedCategory?.length > 0) ? selectedCategory : 'Length Measurement',
      subcategory: selectedSubCategory,
      user,
      dateTime: moment().toDate(),
      projectName: 'Text Measurement',
    });
  };

  // const getPositionStyle = () => {
  //   if (textRef.current) {
  //     const stage = textRef.current.getStage();
  //     if (stage) {
  //       const textPosition = textRef.current.getAbsolutePosition();
  //       const textPositionrect = textRef.current.getClientRect();
  //       const stagePosition = stage.container();

  //       const top = textPosition.y + stagePosition.offsetTop;
  //       const left = textPosition.x + stagePosition.offsetLeft;

  //       // Debugging logs
  //       console.log('Text Position:', textPosition);
  //       console.log('Stage Position:', stagePosition);
  //       console.log('Computed Top:', top);
  //       console.log('Computed Left:', left);

  //       return {
  //         position: 'absolute',
  //         top: top + 'px',
  //         left: left + 'px',
  //         width: textPositionrect.width,
  //         height: textPositionrect.height,
  //       };
  //     }
  //   }
  //   return {
  //     position: 'absolute',
  //     top: 0,
  //     left: 0,
  //     width: 100,
  //     height: 30,
  //   };
  // };

  // const getPositionStyle = () => {
  //   if (textRef.current) {
  //     const stage = textRef.current.getStage();
  //     if (stage) {
  //       const stageContainer = stage.container();
  //       const parentElement = stageContainer.parentElement;

  //       if (parentElement) {
  //         const parentWidth = parentElement.clientWidth;
  //         const parentHeight = parentElement.clientHeight;

  //         return {
  //           position: 'fixed',
  //           top: '50%',
  //           left: '50%',
  //           transform: 'translate(-50%, -50%)',
  //           width: 'auto',  // Adjust as needed for the input field's width
  //           height: 'auto', // Adjust as needed for the input field's height
  //           maxWidth: `${parentWidth}px`,  // Ensure it doesn't overflow the parent
  //           maxHeight: `${parentHeight}px`, // Ensure it doesn't overflow the parent
  //         };
  //       }
  //     }
  //   }

  //   return {
  //     position: 'fixed',
  //     top: '50%',
  //     left: '50%',
  //     transform: 'translate(-50%, -50%)',
  //     width: 'auto',
  //     height: 'auto',
  //   };
  // };

  return (
    <>
      <Text
        id={id}
        ref={textRef}
        text={text}
        fontSize={fontSize}
        x={x}
        y={y}
        draggable
        onMouseDown={(e) => {
          e.cancelBubble = true;
        }}
        onDblClick={handleDblClick}
        // onClick={(e) => {
        //   e.cancelBubble = true;
        //   // e.evt.stopPropagation()
        //   // e.evt.stopImmediatePropagation()
        // }}
        onTransformEnd={handleTransformEnd}
        onDragStart={(e) => {
          e.cancelBubble = true;
          // e.evt.stopPropagation()
          // e.evt.stopImmediatePropagation()
        }}
        onDragMove={(e) => {
          e.cancelBubble = true;
          // e.evt.stopPropagation()
          // e.evt.stopImmediatePropagation()
        }}
        onDragEnd={handleDragEndTxt}
        fill={textColor}
        rotation={rotation}
      />
      <Circle
        x={x - 5} // Position circle near text
        y={y - 5}
        radius={5}
        fill="red"
        onClick={(e) => {
          e.cancelBubble = true;
          // e.evt.stopPropagation()
          // e.evt.stopImmediatePropagation()
          handleDelete({ id });
        }}
      />
      <Transformer
        ref={trRef}
        onClick={(e) => {
          e.evt.stopPropagation();
        }}
        anchorFill={ctrlPressed ? 'red' : ''}
        boundBoxFunc={(oldBox, newBox) => {
          if (newBox.width < 30 || newBox.height < 30) {
            return oldBox;
          }
          return newBox;
        }}
      />
      {isEditing && (
        <Html
          divProps={{
            // style: getPositionStyle() as any,
            style: {
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '600px', // Set a fixed width, or adjust based on your needs
              height: 'auto',
              fontSize: '16px', // Adjust font size if needed
              zIndex: 1000, // Ensure the textarea is above other elements
              backgroundColor: '#fff', // Background color
              padding: '10px', // Padding for the input
              border: '1px solid #ccc', // Border for the input
              borderRadius: '15px', // Rounded corners for the input
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)', // Add a subtle shadow
              opacity: 80,
            },
          }}
        >
          {/* <span className='text-red-600 cursor-pointer' onClick={()=>{handleDelete(text)}}>X</span> */}
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Enter Text"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleBlur();
              }
            }}
            style={{
              width: '100%',
              height: '100%',
              fontSize: `40px`,
              border: 'none',
              backgroundColor: 'transparent',
              //@ts-ignore
              textAlign: textRef.current?.align() || 'left',
              //@ts-ignore
              color: textRef.current?.fill() || 'black',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        </Html>
      )}
    </>
  );
};

export default EditableText;
