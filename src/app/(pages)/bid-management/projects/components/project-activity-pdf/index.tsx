import { PdfHeader } from '@/app/(pages)/financial/components/contractors/clientPDF/Header';
import { IBidActivity } from '@/app/interfaces/bid-management/bid-management.interface';
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import moment from 'moment';
import {
  CALL_ICON,
  GREEN_TRACKING_ICON,
  MAIL_ICON,
  NAVIGATION_ICON,
} from './icons';
import { formatProjectActivityStatus } from '../../../utils';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginTop: 8,
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderBottomColor: '#EAECF0',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activityInfo: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 10,
  },
  companyName: {
    fontWeight: 'bold',
    color: '#344054',
    fontSize: 11,
    lineHeight: 1.25,
  },
  secondaryInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  secondaryText: {
    color: '#667085',
    fontSize: 10,
    lineHeight: 1.25,
  },
  date: {
    color: '#667085',
    fontSize: 11,
    lineHeight: 1.25,
    fontWeight: 'normal',
  },
  flex: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyInfoFlex: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
});

type Props = {
  activities: IBidActivity[];
  projectName: string;
};

function ProjectActivityAndStatusPDF({ activities, projectName }: Props) {
  return (
    <Document>
      <Page size={'A4'}>
        <PdfHeader brandingColor="#6F6AF8" />
        <Text
          style={{
            fontSize: 12,
            color: '#667085',
            fontWeight: 'normal',
            marginTop: 8,
            paddingLeft: 30,
          }}
        >
          Activity and Status Tracking
        </Text>

        <Text
          style={{
            fontSize: 18,
            color: '#344054',
            fontWeight: 'semibold',
            marginVertical: 8,
            paddingLeft: 30,
          }}
        >
          {projectName}
        </Text>

        {activities.length > 0 &&
          activities.map((activity) => {
            const activityUser = activity.user;
            return (
              <View key={activity._id} style={styles.container}>
                <Image
                  src={GREEN_TRACKING_ICON}
                  style={{ height: 18, width: 18 }}
                />
                <View style={styles.activityInfo}>
                  <View style={styles.companyInfoFlex}>
                    <View style={styles.flex}>
                      <Text style={styles.companyName}>
                        {typeof activityUser !== 'string'
                          ? activityUser.companyName ||
                            activityUser.organizationName
                          : ''}
                      </Text>
                      <Text style={[styles.companyName, { marginLeft: 5 }]}>
                        ({formatProjectActivityStatus(activity.status)})
                      </Text>
                    </View>
                    <Text style={styles.date}>
                      {moment(activity.createdAt).format('DD MMMM, h:mm A')}
                    </Text>
                  </View>
                  <View style={styles.secondaryInfo}>
                    <View style={styles.flex}>
                      <Image
                        src={NAVIGATION_ICON}
                        style={{ height: 12, width: 12, marginRight: 7 }}
                      />
                      <Text style={styles.secondaryText}>
                        {typeof activityUser !== 'string'
                          ? activityUser.address
                          : ''}
                      </Text>
                    </View>
                    <View style={[styles.flex, { marginLeft: 14 }]}>
                      <Image
                        src={MAIL_ICON}
                        style={{ height: 12, width: 14, marginRight: 7 }}
                      />
                      <Text style={styles.secondaryText}>
                        {typeof activityUser !== 'string'
                          ? activityUser.email
                          : ''}
                      </Text>
                    </View>
                    <View style={[styles.flex, { marginLeft: 14 }]}>
                      <Image
                        src={CALL_ICON}
                        style={{ height: 12, width: 12, marginRight: 7 }}
                      />
                      <Text style={styles.secondaryText}>
                        {typeof activityUser !== 'string'
                          ? String(activityUser.phone)
                          : ''}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}

        {/* <View style={{
                marginTop: 8
            }}>
                <View style={{
                    width: 14.91,
                    height: 14.91,
                    borderRadius: '50%',
                    backgroundColor: "#36B37E",

                }}></View>

            </View> */}

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

export default ProjectActivityAndStatusPDF;
