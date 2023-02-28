import React, {useState} from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  FlatList,
} from 'react-native';
import {
  MeetingProvider,
  useMeeting,
  useParticipant,
  MediaStream,
  RTCView,
  mediaDevices,
} from '@videosdk.live/react-native-sdk';
import {createMeeting, token} from './api';
import VideosdkRPK from './VideosdkRPK';
// import { useFocusEffect } from "@react-navigation/native";

function JoinScreen(props) {
  const [meetingVal, setMeetingVal] = useState('');
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#F6F6FF',
        justifyContent: 'center',
        paddingHorizontal: 6 * 10,
      }}>
      <TouchableOpacity
        onPress={() => {
          props.getMeetingId();
        }}
        style={{backgroundColor: '#1178F8', padding: 12, borderRadius: 6}}>
        <Text style={{color: 'white', alignSelf: 'center', fontSize: 18}}>
          Create Meeting
        </Text>
      </TouchableOpacity>

      <Text
        style={{
          alignSelf: 'center',
          fontSize: 22,
          marginVertical: 16,
          fontStyle: 'italic',
          color: 'grey',
        }}>
        ---------- OR ----------
      </Text>
      <TextInput
        value={meetingVal}
        onChangeText={setMeetingVal}
        placeholder={'XXXX-XXXX-XXXX'}
        style={{
          padding: 12,
          borderWidth: 1,
          borderRadius: 6,
          fontStyle: 'italic',
        }}
      />
      <TouchableOpacity
        style={{
          backgroundColor: '#1178F8',
          padding: 12,
          marginTop: 14,
          borderRadius: 6,
        }}
        onPress={() => {
          props.getMeetingId(meetingVal);
        }}>
        <Text style={{color: 'white', alignSelf: 'center', fontSize: 18}}>
          Join Meeting
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const Button = ({onPress, buttonText, backgroundColor}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        borderRadius: 4,
      }}>
      <Text style={{color: 'white', fontSize: 12}}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

function ControlsContainer({
  join,
  leave,
  toggleWebcam,
  enableScreenShare,
  chageWeb,
}) {
  return (
    <View
      style={{
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <Button
        onPress={() => {
          join();
        }}
        buttonText={'Join'}
        backgroundColor={'#1178F8'}
      />
      <Button
        onPress={() => {
          toggleWebcam();
        }}
        buttonText={'Toggle Webcam'}
        backgroundColor={'#1178F8'}
      />
      <Button
        onPress={() => {
          // toggleMic();
          enableScreenShare();
        }}
        buttonText={'Toggle Mic'}
        backgroundColor={'#1178F8'}
      />
      <Button
        onPress={() => {
          leave();
        }}
        buttonText={'Leave'}
        backgroundColor={'#FF0000'}
      />
      <Button
        onPress={() => {
          chageWeb();
        }}
        buttonText={'cccc'}
        backgroundColor={'#FF0000'}
      />
    </View>
  );
}
function ParticipantView({participantId}) {
  const {webcamStream, webcamOn} = useParticipant(participantId);

  return webcamOn && webcamStream ? (
    <RTCView
      streamURL={new MediaStream([webcamStream.track]).toURL()}
      objectFit={'cover'}
      style={{
        height: 300,
        marginVertical: 8,
        marginHorizontal: 8,
      }}
    />
  ) : (
    <View
      style={{
        backgroundColor: 'grey',
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{fontSize: 16}}>NO MEDIA</Text>
    </View>
  );
}

function ParticipantList({participants}) {
  return participants.length > 0 ? (
    <FlatList
      data={participants}
      renderItem={({item}) => {
        return <ParticipantView participantId={item} />;
      }}
    />
  ) : (
    <View
      style={{
        flex: 1,
        backgroundColor: '#F6F6FF',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{fontSize: 20}}>Press Join button to enter meeting.</Text>
    </View>
  );
}

function MeetingView() {
  // Get `participants` from useMeeting Hook
  const {
    join,
    leave,
    toggleWebcam,
    toggleMic,
    participants,
    enableScreenShare,
    presenterId,
    changeWebcam,
  } = useMeeting({onPresenterChanged});
  console.log('presenterId', presenterId);
  const participantsArrId = [...participants.keys()];

  const {webcamOn, webcamStream, displayName, setQuality, isLocal, micOn} =
    useParticipant(presenterId, {
      onStreamEnabled,
      onStreamDisabled,
    });
  console.log('webcamStream', webcamStream);
  return (
    <View style={{flex: 1}}>
      <ParticipantList participants={participantsArrId} />
      {presenterId && webcamStream && (
        <RTCView
          streamURL={new MediaStream([webcamStream.track]).toURL()}
          objectFit={'cover'}
          mirror={isLocal ? true : false}
          style={{
            height: 300,
            marginVertical: 8,
            marginHorizontal: 8,
          }}
        />
      )}

      <ControlsContainer
        join={join}
        leave={leave}
        toggleWebcam={toggleWebcam}
        toggleMic={toggleMic}
        enableScreenShare={enableScreenShare}
        chageWeb={changeWebcam}
      />
    </View>
  );
}

export default function App() {
  const [meetingId, setMeetingId] = useState(null);

  const getMeetingId = async id => {
    const meetingId = id == null ? await createMeeting({token}) : id;
    console.log('meetingId', meetingId);
    setMeetingId(meetingId);
  };
  // React.useEffect(() => {
  //   if (Platform.OS == 'ios') {
  //     VideosdkRPK.addListener('onScreenShare', event => {
  //       console.log('event', event);
  //       if (event === 'START_BROADCAST') {
  //         enableScreenShare();
  //       } else if (event === 'STOP_BROADCAST') {
  //         disableScreenShare();
  //       }
  //     });

  //     return () => {
  //       VideosdkRPK.removeSubscription('onScreenShare');
  //     };
  //   }
  // }, []);
  React.useEffect(
    React.useCallback(() => {
      mediaDevices
        .getUserMedia({audio: false, video: true})
        .then(stream => {
          console.log('::::::::::::::::', stream);
          // setTrack(stream);
        })
        .catch(e => {
          console.log(e);
        });
    }, []),
  );

  return meetingId ? (
    <SafeAreaView style={{flex: 1, backgroundColor: '#F6F6FF'}}>
      <MeetingProvider
        config={{
          meetingId,
          micEnabled: false,
          webcamEnabled: true,
          name: 'Test User',
        }}
        token={token}>
        <MeetingView />
      </MeetingProvider>
    </SafeAreaView>
  ) : (
    <JoinScreen getMeetingId={getMeetingId} />
  );
}
