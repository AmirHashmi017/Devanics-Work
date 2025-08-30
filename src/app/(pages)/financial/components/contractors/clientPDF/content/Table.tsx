import { View } from '@react-pdf/renderer';
import { PdfHeading, PdfText } from './Heading';

type Props = {
  items: {
    description: string;
    quantity: number;
    total: number;
  }[];
  totalAmount: number;
};

export const PdfTable: React.FC<Props> = ({ items, totalAmount }) => {
  return (
    <View style={{ flexDirection: 'column' }}>
      <View
        style={{
          marginTop: 5,
          border: '1px solid #f9f5ff',
          padding: 5,
          borderRadius: 5,
        }}
      >
        <View
          style={{
            width: '100%',
            borderRadius: 5,
          }}
        >
          <View
            style={{
              backgroundColor: '#f9f5ff',
              border: '1px solid #f9f5ff',
            }}
          >
            <View
              style={{
                borderBottom: '1px solid #f9f5ff',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: '4px 4px',
              }}
            >
              <PdfHeading
                text="Item / Description"
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  flex: 1,
                }}
              />
              <PdfHeading
                text="Quantity"
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  flex: 1,
                }}
              />
              <PdfHeading
                text="Total Price"
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  flex: 1,
                }}
              />
            </View>
          </View>
        </View>
        <View
          style={{
            width: '100%',
            borderRadius: 5,
          }}
        >
          {items?.length &&
            items?.map((item, index) => {
              console.log(items, 'itemsitemsitemsitems');

              return (
                <View
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: '4px 4px',
                  }}
                >
                  <PdfText
                    text={item.description}
                    style={{
                      fontWeight: 'bold',
                      width: '100%',
                      flex: 1,
                    }}
                  />
                  <PdfText
                    text={`${item.quantity}`}
                    style={{
                      fontWeight: 'bold',
                      width: '100%',
                      flex: 1,
                      textAlign: 'center',
                    }}
                  />
                  <PdfText
                    text={`${item.total}`}
                    style={{
                      fontWeight: 'bold',
                      width: '100%',
                      flex: 1,
                      textAlign: 'center',
                    }}
                  />
                </View>
              );
            })}
        </View>
      </View>
      <TotalAmount amount={totalAmount} />
    </View>
  );
};

const TotalAmount = ({ amount }: { amount: number }) => (
  <View
    style={{
      paddingTop: 3,
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      flexDirection: 'row',
      paddingRight: 4,
    }}
  >
    <PdfHeading text="Total: " />
    <PdfText text={`$${amount}`} style={{ fontSize: 14 }} />
  </View>
);
