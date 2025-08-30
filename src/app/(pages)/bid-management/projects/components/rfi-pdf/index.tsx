import { PdfHeader } from '@/app/(pages)/financial/components/contractors/clientPDF/Header';
import { IRFI } from '@/app/interfaces/rfi.interface';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import moment from 'moment';

const styles = StyleSheet.create({
  container: {
    paddingLeft: 30,
    marginTop: 9,
    display: 'flex',
    backgroundColor: '#fff',
    border: 1,
    borderColor: '#e6e6e6',
    paddingVertical: 4,
    borderRadius: 5,
  },
  companyContainer: {},
  companyInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  companyName: {
    fontSize: 16,
    color: '#667085',
    fontWeight: 'normal',
  },
  description: {
    fontSize: 14,
    color: '#344054',
    fontWeight: 'normal',
    marginTop: 3,
  },
  replyContainer: {
    display: 'flex',
    borderTop: 1,
    borderColor: '#e6e6e6',
    marginTop: 5,
  },
});

type Props = {
  rfis: IRFI[];
};

function ProjectRFIPDF({ rfis }: Props) {
  const parentRfis = rfis.filter((rfi) => !rfi.responseTo);
  const rfiReplies = (rfiId: string) =>
    rfis.filter((rfi) => rfi.responseTo && rfi.responseTo === rfiId);

  return (
    <Document>
      <Page
        size={'A4'}
        style={{
          backgroundColor: '#fefefe',
        }}
      >
        <PdfHeader brandingColor="#6F6AF8" />
        <Text
          style={{
            fontSize: 20,
            color: '#344054',
            fontWeight: 'semibold',
            marginTop: 8,
            paddingLeft: 30,
          }}
        >
          RFI Center
        </Text>

        {parentRfis.map((rfi) => {
          const user = rfi.user;
          return (
            <View key={rfi._id} style={styles.container}>
              <View style={styles.companyContainer}>
                <View style={styles.companyInfo}>
                  <Text style={styles.companyName}>
                    {`${typeof user !== 'string' ? user.companyName || user.organizationName || user.name : ''} | ${moment(rfi.createdAt).format('MMM DD, YYYY, hh:mm A')}`}
                  </Text>
                  <Text style={styles.description}>{rfi.description}</Text>
                </View>
              </View>

              {rfiReplies(rfi._id).map((reply) => {
                const replyUser = reply.user;
                return (
                  <View key={reply._id} style={styles.replyContainer}>
                    <View style={styles.companyInfo}>
                      <Text style={styles.companyName}>
                        {`${typeof replyUser !== 'string' ? replyUser.companyName || replyUser.organizationName || replyUser.name : ''} | ${moment(reply.createdAt).format('MMM DD, YYYY, hh:mm A')}`}
                      </Text>
                      <Text style={styles.description}>
                        {reply.description}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          );
        })}

        <View
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            padding: 7,
            backgroundColor: '#F4EBFF',
          }}
        >
          <Text
            style={{
              fontSize: 10,
              textAlign: 'center',
              color: '#475467',
              fontWeight: 'normal',
            }}
          >
            &copy; {new Date().getFullYear()} Schesti. All Rights Reserved.
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export default ProjectRFIPDF;
