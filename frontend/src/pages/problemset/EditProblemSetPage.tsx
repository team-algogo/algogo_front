import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategoryList } from "@api/problemset/getCategoryList";
import { getProblemSetDetail } from "@api/problemset/getProblemSetDetail";
import { updateProblemSet } from "@api/problemset/updateProblemSet";
import Button from "@components/button/Button";

export default function EditProblemSetPage() {
  const { programId } = useParams<{ programId: string }>();
  const id = Number(programId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 문제집 상세 정보 조회
  const { data: detail } = useQuery({
    queryKey: ["problemSetDetail", id],
    queryFn: () => getProblemSetDetail(id),
    enabled: !isNaN(id),
  });

  // 카테고리 목록 조회
  const { data: categoryList } = useQuery({
    queryKey: ["categoryList"],
    queryFn: getCategoryList,
  });

  // 초기 데이터 설정
  useEffect(() => {
    if (detail) {
      setTitle(detail.title || "");
      setDescription(detail.description || "");
      setSelectedCategories(detail.categories || []);
      if (detail.thumbnail) {
        setThumbnailPreview(detail.thumbnail);
      }
    }
  }, [detail]);

  // 파일 선택 핸들러
  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setThumbnailPreview(detail?.thumbnail || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 카테고리 토글
  const handleCategoryToggle = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName],
    );
  };

  // 수정 mutation
  const updateMutation = useMutation({
    mutationFn: (formData: FormData) => updateProblemSet(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problemSets"] });
      queryClient.invalidateQueries({ queryKey: ["problemSetDetail", id] });
      navigate("/problemset");
    },
    onError: (error: any) => {
      if (error.response?.status === 403) {
        setError("권한이 없습니다.");
      } else if (error.response?.status === 409) {
        setError("이미 존재하는 문제집입니다.");
      } else if (error.response?.status === 400) {
        setError("입력 정보를 확인해주세요.");
      } else {
        setError("문제집 수정에 실패했습니다.");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }

    if (!description.trim()) {
      setError("설명을 입력해주세요.");
      return;
    }

    if (selectedCategories.length === 0) {
      setError("카테고리를 하나 이상 선택해주세요.");
      return;
    }

    const formData = new FormData();

    // dto를 JSON 문자열로 전송
    const dto = {
      title: title.trim(),
      description: description.trim(),
      categories: selectedCategories,
    };
    formData.append("dto", JSON.stringify(dto));

    // thumbnail은 파일로 전송 (새로운 파일이 선택된 경우에만)
    if (selectedFile) {
      formData.append("thumbnail", selectedFile);
    }

    updateMutation.mutate(formData);
  };

  const handleCancel = () => {
    navigate("/problemset");
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-[1200px] flex-col items-start gap-8 bg-white p-[40px_0px_80px]">
      <div className="w-full">
        <h1 className="text-[28px] font-bold text-[#333333]">문제집 수정</h1>
        <p className="mt-2 text-sm text-gray-500">문제집 정보를 수정하세요.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6">
        {/* 제목 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            제목 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#0D6EFD] focus:ring-2 focus:ring-[#0D6EFD] focus:ring-offset-0 focus:outline-none"
            placeholder="문제집 제목을 입력하세요"
          />
        </div>

        {/* 설명 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            설명 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#0D6EFD] focus:ring-2 focus:ring-[#0D6EFD] focus:ring-offset-0 focus:outline-none"
            placeholder="문제집 설명을 입력하세요"
          />
        </div>

        {/* 카테고리 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            카테고리 <span className="text-red-500">*</span>
          </label>
          {categoryList && categoryList.length > 0 ? (
            <div className="flex flex-wrap gap-3 rounded-md border border-gray-300 p-4">
              {categoryList.map((category) => (
                <label
                  key={category.id}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <input
                    type="checkbox"
                    value={category.name}
                    checked={selectedCategories.includes(category.name)}
                    onChange={() => handleCategoryToggle(category.name)}
                    className="text-primary-500 focus:ring-primary-500 h-4 w-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              카테고리 목록을 불러올 수 없습니다.
            </p>
          )}
        </div>

        {/* 썸네일 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            썸네일 이미지
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {thumbnailPreview ? (
            <div className="flex flex-col gap-2">
              <img
                src={thumbnailPreview}
                alt="Thumbnail preview"
                className="h-40 w-40 rounded-lg object-cover"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleFileClick}
                >
                  변경
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleRemoveFile}
                >
                  제거
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleFileClick}
              className="flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-sm text-gray-500 hover:border-gray-400"
            >
              이미지 선택
            </button>
          )}
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* 버튼 */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={handleCancel}
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "수정 중..." : "수정하기"}
          </Button>
        </div>
      </form>
    </div>
  );
}
