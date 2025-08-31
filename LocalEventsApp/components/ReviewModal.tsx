import { View } from "react-native";
import { Button, Dialog, Portal } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface ReviewModalProps {
  visible: boolean;
  rating: number | null;
  setRating: (val: number) => void;
  onDismiss: () => void;
  onSubmit: () => void;
}

export const ReviewModal = ({
  visible,
  rating,
  setRating,
  onDismiss,
  onSubmit,
}: ReviewModalProps) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Leave Review</Dialog.Title>
        <Dialog.Content>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginVertical: 10,
            }}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <Icon
                key={star}
                name={star <= (rating || 0) ? "star" : "star-outline"}
                size={36}
                color={star <= (rating || 0) ? "#FFD700" : "#999"}
                style={{ marginHorizontal: 4 }}
                onPress={() => setRating(star)}
              />
            ))}
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onSubmit} disabled={!rating}>
            Submit
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
