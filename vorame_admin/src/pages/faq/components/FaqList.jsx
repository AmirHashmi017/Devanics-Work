import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import SingleFaq from "./SingleFaq";

const FaqList = ({ initialFaqs }) => {
  const [faqs, setFaqs] = useState(initialFaqs);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(faqs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setFaqs(items);

    // TODO: Sync with backend
    // axios.post('/update-faq-order', items.map(f => f._id));
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="faq-list">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {faqs.map((faq, index) => (
              <Draggable key={faq._id} draggableId={faq._id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      marginBottom: "12px",
                      ...provided.draggableProps.style,
                    }}
                  >
                    <SingleFaq {...faq} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default FaqList;