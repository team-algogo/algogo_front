import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Modal from "./components/modal/popup/PopupModal";
import PopupModalHeader from "./components/modal/popup/PopupModalHeader";
import PopupModalContent from "./components/modal/popup/PopupModalContent";
import PopupModalFooter from "./components/modal/popup/PopupModalFooter";
import AlertModal from "./components/modal/alarm/AlertModal";
import Header from "./components/header/Header";

const queryClient = new QueryClient();

function App() {
  const handleDelete = () => {
    console.log("삭제 완료!");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-8 space-y-8">
        <Header />

        <div className="flex gap-4">
          <Modal.Trigger className="px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-dark">
            그룹 삭제 팝업 열기
          </Modal.Trigger>

          <AlertModal.Trigger className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            사전 매칭 신청
          </AlertModal.Trigger>
        </div>

        <Modal>
          <PopupModalHeader>스터디 그룹</PopupModalHeader>
          <PopupModalContent>
            "스터디 그룹" 그룹에서 삭제하시겠습니까?
          </PopupModalContent>
          <PopupModalFooter>
            <PopupModalFooter.CloseButton variant="secondary">
              취소
            </PopupModalFooter.CloseButton>
            <PopupModalFooter.ActionButton
              variant="primary"
              onClick={handleDelete}
            >
              삭제
            </PopupModalFooter.ActionButton>
          </PopupModalFooter>
        </Modal>

        <AlertModal>
          <AlertModal.Content autoCloseDelay={3000}>
            <AlertModal.Message className="font-medium">
              사전 매칭 신청이 완료되었습니다👏
            </AlertModal.Message>
            <AlertModal.Message className="text-sm mt-2">
              오픈 예정일 N일 전에 마이페이지에서 확인 가능합니다
            </AlertModal.Message>
          </AlertModal.Content>
        </AlertModal>
      </div>
    </QueryClientProvider>
  );
}

export default App;
