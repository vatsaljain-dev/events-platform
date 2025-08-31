import { ScrollView, Text } from "react-native";
import { Button, Modal, Portal, TextInput } from "react-native-paper";

interface AddEventModalProps {
  visible: boolean;
  title: string;
  location: string;
  time: string;
  tags: string;
  setTitle: (val: string) => void;
  setLocation: (val: string) => void;
  setTime: (val: string) => void;
  setTags: (val: string) => void;
  onDismiss: () => void;
  onSave: () => void;
}

export const AddEventModal = ({
  visible,
  title,
  location,
  time,
  tags,
  setTitle,
  setLocation,
  setTime,
  setTags,
  onDismiss,
  onSave,
}: AddEventModalProps) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={{
          borderRadius: 20,
          backgroundColor: "white",
          padding: 20,
        }}
        style={{
          justifyContent: "center",
          margin: 20,
        }}
        dismissable
        dismissableBackButton
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <Text
            style={{ fontSize: 22, fontWeight: "700", marginBottom: 20 }}
          >
            Add Event
          </Text>

          <TextInput
            label="Title"
            value={title}
            onChangeText={setTitle}
            style={{ marginBottom: 15, backgroundColor: "white" }}
            mode="outlined"
          />
          <TextInput
            label="Location"
            value={location}
            onChangeText={setLocation}
            style={{ marginBottom: 15, backgroundColor: "white" }}
            mode="outlined"
          />
          <TextInput
            label="Time"
            value={time}
            onChangeText={setTime}
            style={{ marginBottom: 15, backgroundColor: "white" }}
            mode="outlined"
          />
          <TextInput
            label="Tags (comma separated)"
            value={tags}
            onChangeText={setTags}
            style={{ marginBottom: 20, backgroundColor: "white" }}
            mode="outlined"
          />

          <Button
            mode="contained"
            onPress={onSave}
            style={{ marginVertical: 10, borderRadius: 8 }}
            contentStyle={{ paddingVertical: 8 }}
          >
            Save
          </Button>
        </ScrollView>
      </Modal>
    </Portal>
  );
};
