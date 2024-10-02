import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea
} from "@nextui-org/react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    console.log("Feedback submitted:", feedback);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold">We Value Your Feedback</h2>
              <p className="text-default-500">Help us improve your experience</p>
            </ModalHeader>
            <ModalBody>
              <Textarea
                label="Your feedback"
                placeholder="Tell us what you think..."
                value={feedback}
                onValueChange={setFeedback}
                minRows={5}
                size="lg"
                variant="bordered"
                classNames={{
                  input: "resize-y min-h-[100px]",
                  inputWrapper: "h-auto",
                }}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button 
                color="primary" 
                onPress={handleSubmit}
                endContent={<SendIcon />}
                isDisabled={!feedback.trim()}
              >
                Send Feedback
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

// SendIcon component định nghĩa trong cùng file
const SendIcon = (props) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M7.39999 6.32003L15.89 3.49003C19.7 2.22003 21.77 4.30003 20.51 8.11003L17.68 16.6C15.78 22.31 12.66 22.31 10.76 16.6L9.91999 14.08L7.39999 13.24C1.68999 11.34 1.68999 8.23003 7.39999 6.32003Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
    <path
      d="M10.11 13.6501L13.69 10.0601"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);