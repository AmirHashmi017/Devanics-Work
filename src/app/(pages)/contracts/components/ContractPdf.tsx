import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { PdfContractMode, ToolState } from '../types';
import { usePDFJS } from '@/app/hooks/usePdf';
import DroppableArea from './DroppableArea';
import DraggableItem from './DraggableItem';
import { StandardToolItem } from './standard-tools-items';
import SenaryHeading from '@/app/component/headings/senaryHeading';
import DraggableTool from './DraggableTool';
import {
  ContractPartyType,
  ICrmContract,
} from '@/app/interfaces/crm/crm-contract.interface';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'react-toastify';
import { hexToRgba } from '@/app/utils/colors.utils';
import { ToolButton } from './ToolButton';
import {
  CalendarOutlined,
  CommentOutlined,
  FontSizeOutlined,
  LoadingOutlined,
  SignatureOutlined,
} from '@ant-design/icons';
import { Spin } from 'antd';
import _ from 'lodash';

type Props = {
  mode: PdfContractMode;
  pdfFile: string;
  contract: ICrmContract;
  tools: ToolState[];
  setTools: React.Dispatch<React.SetStateAction<ToolState[]>>;
  color?: string;
  receipt: ContractPartyType | null;
  toolToFillIndexRef?: number | null;
  setToolToFillIndexRef?: React.Dispatch<React.SetStateAction<number | null>>;
  onPdfReady?: (isReady: boolean) => void;
};

export const ContractPdf = forwardRef<
  {
    handleAction: (_cb: (_blob: Blob) => void, _shouldSave?: boolean) => void;
  },
  Props
>(
  (
    {
      mode,
      pdfFile,
      tools,
      setTools,
      contract,
      receipt,
      color = '#007ab6',
      toolToFillIndexRef = null,
      setToolToFillIndexRef,
      onPdfReady,
    },
    ref
  ) => {
    // const [activePage, setActivePage] = useState<null | number>(1)
    // const canvasRefs = useRef<HTMLCanvasElement[]>([]);
    const { PDFJs } = usePDFJS(async () => {});
    const containerRef = useRef<HTMLDivElement>(null);
    const pdfContainerRef = useRef<HTMLDivElement>(null);

    const [selectedTool, setSelectedTool] = useState<ToolState | null>(null);

    const [toolToFill, setToolToFill] = useState<ToolState | undefined>(
      undefined
    );

    const [isLoading, setIsLoading] = useState<boolean>(false);

    // const callback = useMemoizedFn((entry) => {
    //     if (entry.isIntersecting) {
    //         setActivePage(parseInt(entry.target.getAttribute("id")!));
    //     }
    // });

    // useInViewport(canvasRefs.current, {
    //     callback: callback,
    //     root: () => containerRef.current,
    // })

    useImperativeHandle(ref, () => ({
      handleAction: (cb) => handleDownload(cb),
    }));

    useEffect(() => {
      loadPdf();
    }, [PDFJs]);

    // a useEffect that will trigger when toolToFillIndex changes
    useEffect(() => {
      if (toolToFillIndexRef !== null) {
        const toolToFillItem = tools[toolToFillIndexRef];
        setToolToFill(toolToFillItem);
        if (toolToFillItem && containerRef.current) {
          containerRef.current.scrollTo({
            top: toolToFillItem.position.y - 100,
            left: toolToFillItem.position.x - 100,
            behavior: 'smooth',
          });
        }
      }
    }, [toolToFillIndexRef]);

    async function loadPdf() {
      if (PDFJs) {
        setIsLoading(true);
        try {
          const pdf = await PDFJs.getDocument(pdfFile).promise;

          for (let index = 1; index <= pdf.numPages; index++) {
            const page = await pdf.getPage(index);
            const viewport = page.getViewport({ scale: 1.8 });

            const canvas = document.createElement('canvas');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            canvas.id = `${index}`;
            canvas.dataset.pageNo = index.toString();

            const context = canvas.getContext('2d')!;
            const renderContext = {
              canvasContext: context!,
              viewport: viewport,
            };
            // canvasRefs.current.push(canvas);

            await page.render(renderContext).promise;

            // Add id to the canvas
            const textCanvas = document.createElement('canvas');
            textCanvas.height = viewport.height;
            textCanvas.width = viewport.width;
            const textContext = textCanvas.getContext('2d')!;
            textContext.font = '16px Arial';
            textContext.fillStyle = 'black';
            textContext.fillText(
              `Schesti-Contract-ID: ${contract._id}`,
              30,
              30
            );
            // Overlay the text canvas on the main canvas
            context.drawImage(textCanvas, 0, 0);
            if (containerRef.current) {
              containerRef.current.appendChild(canvas);
            }
          }
        } catch (error) {
          toast.error('Unable to load the pdf');
        } finally {
          setIsLoading(false);
          onPdfReady?.(true);
        }
      }
    }

    function getXAndY(offset: { x: number; y: number }) {
      const containerRect = containerRef.current!.getBoundingClientRect();
      const scrollTop = containerRef.current!.scrollTop;
      const scrollLeft = containerRef.current!.scrollLeft;

      const x = offset.x - containerRect.left + scrollLeft;
      const y = offset.y - containerRect.top + scrollTop;
      return { x, y };
    }

    function handleRemoveTool(item: ToolState) {
      setTools((prev) => prev.filter((tool) => tool.id !== item.id));
    }

    function handleItemClick(item: ToolState) {
      if (mode === 'add-values') {
        setSelectedTool(item);
      }
    }

    function handleCloseModal() {
      setSelectedTool(null);
    }

    function handleValueChange(item: ToolState, shouldClose: boolean = true) {
      if (mode === 'add-values') {
        if (shouldClose) {
          setSelectedTool(null);
        } else {
          setSelectedTool(item);
        }

        // Let's find next item using lodash
        const itemIndex = _.findIndex(tools, (tool) => tool.id === item.id);
        // If item is found
        if (itemIndex !== -1) {
          // Find next item
          const nextItemIndex = itemIndex + 1;
          if (nextItemIndex < tools.length) {
            // Set next item as toolToFill
            setToolToFillIndexRef?.(nextItemIndex);
          }
        }

        setTools((prev) => {
          return prev.map((tool) => {
            return tool.id === item.id
              ? { ...item, date: new Date().toISOString() }
              : tool;
          });
        });
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function handleDownload(cb: (blob: Blob) => void, shouldSave = true) {
      const container = containerRef.current!;
      container.style.height = 'auto'; // Temporarily expand the container

      html2canvas(container, { useCORS: true, scale: 1 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png', 0.75);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let positionY = 0;
        const pageHeight = pdf.internal.pageSize.height;

        while (positionY < imgHeight) {
          pdf.addImage(
            imgData,
            'PNG',
            0,
            -positionY,
            imgWidth,
            imgHeight,
            undefined,
            'FAST'
          );
          positionY += pageHeight;
          if (positionY < imgHeight) {
            pdf.addPage();
          }
        }
        cb(pdf.output('blob'));
        if (shouldSave) {
          pdf.save(`${contract.title}.pdf`);
        }

        // Restore the original height
        container.style.height = ''; // Remove inline style to revert to original
      });
    }
    // function handleDownload(cb: (_blob: Blob) => void, shouldSave = true) {
    //   const container = containerRef.current!;
    //   const originalHeight = container.style.height;
    //   const originalOverflow = container.style.overflow;

    //   // Ensure full content is captured
    //   container.style.height = 'auto';
    //   container.style.overflow = 'visible';

    //   // Get the exact dimensions of the container
    //   const containerWidth = container.scrollWidth;
    //   const containerHeight = container.scrollHeight;

    //   html2canvas(container, {
    //     useCORS: true,
    //     scale: 2, // Higher scale for better quality
    //     logging: false,
    //     allowTaint: true,
    //     width: containerWidth,
    //     height: containerHeight,
    //     windowWidth: containerWidth,
    //     windowHeight: containerHeight,
    //   })
    //     .then((canvas) => {
    //       const pdf = new jsPDF({
    //         orientation: 'p',
    //         unit: 'px',
    //         format: [containerWidth, containerHeight],
    //       });

    //       const canvasHeight = canvas.height; // Actual canvas height
    //       const pageHeight = pdf.internal.pageSize.height; // PDF page height
    //       const totalPages = Math.ceil(canvasHeight / pageHeight); // Calculate how many pages we need based on canvas height

    //       for (let page = 0; page < totalPages; page++) {
    //         // Add a new page if it's not the first page
    //         // if (page > 0) {
    //         //   pdf.addPage([containerWidth, pageHeight]);
    //         // }

    //         // Calculate the portion of the image to draw on this page
    //         const sourceY = page * pageHeight; // Start at the current page's Y position
    //         const remainingHeight = canvasHeight - sourceY;

    //         // Calculate the height of the image portion to be drawn on this page
    //         const imageHeight =
    //           remainingHeight < pageHeight ? remainingHeight : pageHeight;

    //         // Draw the image for this portion
    //         pdf.addImage(
    //           canvas.toDataURL('image/png'),
    //           'PNG',
    //           0,
    //           -sourceY, // Negative to shift the image up
    //           containerWidth,
    //           imageHeight,
    //           undefined, // Default handling
    //           'FAST', // Faster image processing
    //           0 // No rotation
    //         );
    //       }

    //       const pdfBlob = pdf.output('blob');
    //       cb(pdfBlob);

    //       if (shouldSave) {
    //         pdf.save(`${contract.title}.pdf`);
    //       }

    //       // Restore original styles
    //       container.style.height = originalHeight;
    //       container.style.overflow = originalOverflow;
    //     })
    //     .catch((error) => {
    //       console.error('Error generating PDF:', error);

    //       // Restore original styles in case of error
    //       container.style.height = originalHeight;
    //       container.style.overflow = originalOverflow;
    //     });
    // }

    return (
      <div className="flex gap-6 ">
        <Spin spinning={isLoading} indicator={<LoadingOutlined spin />}>
          <div
            className="w-[300px] md:w-[550px] lg:w-full lg:max-w-[1200px] "
            ref={pdfContainerRef}
          >
            <DroppableArea
              onDrop={(item, offset) => {
                if ('type' in item) {
                  const { x, y } = getXAndY(offset);
                  setTools((prev) => [
                    ...prev,
                    {
                      tool: item.type,
                      position: { x, y },
                      id: Math.random().toString(36).slice(0, 20),
                    },
                  ]);
                } else {
                  setTools((prev) => {
                    return prev.map((tool) => {
                      // const { x, y } = getXAndY(offset);
                      return tool.id === item.id
                        ? { ...tool, position: { ...offset } }
                        : tool;
                    });
                  });
                }
              }}
            >
              <div
                id="container"
                ref={containerRef}
                className="rounded-md overflow-x-scroll overflow-y-scroll relative h-[calc(100vh-150px)]"
              >
                {tools.map((item) => {
                  return mode === 'add-values' ? (
                    <StandardToolItem
                      onClick={() => handleItemClick(item)}
                      onClose={handleCloseModal}
                      selectedTool={selectedTool}
                      onChange={handleValueChange}
                      mode={mode}
                      item={item}
                      key={item.id}
                      contract={contract}
                      color={color}
                      tools={tools}
                      receipt={receipt}
                      toolToFill={toolToFill}
                    />
                  ) : mode === 'edit-fields' ? (
                    <DraggableItem type={item.tool} key={item.id} data={item}>
                      <StandardToolItem
                        selectedTool={null}
                        color={color}
                        mode={mode}
                        item={item}
                        key={item.id}
                        onDelete={() => handleRemoveTool(item)}
                        contract={contract}
                        receipt={null}
                      />
                    </DraggableItem>
                  ) : mode === 'view-fields' || mode === 'view-values' ? (
                    <StandardToolItem
                      color={color}
                      onClick={() => {}}
                      onClose={() => {}}
                      selectedTool={selectedTool}
                      onChange={() => {}}
                      mode={mode}
                      item={item}
                      key={item.id}
                      contract={contract}
                      receipt={receipt}
                    />
                  ) : null;
                })}
              </div>
            </DroppableArea>
          </div>
        </Spin>

        {mode === 'edit-fields' ? (
          <div className="flex flex-col space-y-3 rounded-md bg-white h-fit p-4 ">
            <SenaryHeading
              title="Standard Tools"
              className="text-xl  font-semibold"
            />
            <DraggableTool type="signature">
              <ToolButton
                text="Signature"
                Icon={<SignatureOutlined />}
                style={{
                  backgroundColor: `${hexToRgba(color, 0.1)}`,
                  border: `1px solid ${hexToRgba(color, 0.1)}`,
                  color,
                }}
              />
            </DraggableTool>

            <DraggableTool type="initials">
              <ToolButton
                text="Initials"
                style={{
                  backgroundColor: `${hexToRgba(color, 0.1)}`,
                  border: `1px solid ${hexToRgba(color, 0.1)}`,
                  color,
                }}
                Icon={<FontSizeOutlined />}
              />
            </DraggableTool>

            <DraggableTool type="comment">
              <ToolButton
                text="Comments"
                style={{
                  backgroundColor: `${hexToRgba(color, 0.1)}`,
                  border: `1px solid ${hexToRgba(color, 0.1)}`,
                  color,
                }}
                Icon={<CommentOutlined />}
              />
            </DraggableTool>

            <DraggableTool type="date">
              <ToolButton
                text="Date"
                style={{
                  backgroundColor: `${hexToRgba(color, 0.1)}`,
                  border: `1px solid ${hexToRgba(color, 0.1)}`,
                  color,
                }}
                Icon={<CalendarOutlined />}
              />
            </DraggableTool>
          </div>
        ) : null}
      </div>
    );
  }
);

ContractPdf.displayName = 'ContractPdf';

// {/* <div ref={containerRef} className="border border-black"></div> */}
