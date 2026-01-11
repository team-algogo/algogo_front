import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createProblemSet } from "@api/problemset/createProblemSet";
import { getCategoryList } from "@api/problemset/getCategoryList";
import Button from "@components/button/Button";
import BasePage from "@pages/BasePage";

export default function CreateProblemSetPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 카테고리 목록 조회
  const { data: categoryList } = useQuery({
    queryKey: ["categoryList"],
    queryFn: getCategoryList,
  });

  const createMutation = useMutation({
    mutationFn: createProblemSet,
    onSuccess: (data) => {
      // 성공 시 생성된 문제집 상세 페이지로 이동
      navigate(`/problemset/${data.data.programId}`);
    },
    onError: (err: any) => {
      const status = err.response?.status;
      const errorCode = err.response?.data?.errorCode;

      if (status === 403 || errorCode === "ACCESS_DENIED") {
        setError("관리자 권한이 필요합니다.");
      } else if (status === 409 || errorCode === "PROBLEM_SET_ALREADY_EXISTS") {
        setError("이미 존재하는 문제집 제목입니다.");
      } else if (status === 400 || errorCode === "PROGRAM_TYPE_NOT_FOUND") {
        setError("DB 설정 오류가 발생했습니다. 관리자에게 문의하세요.");
      } else {
        setError("문제집 생성에 실패했습니다. 다시 시도해주세요.");
      }
    },
  });

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 이미지 파일만 허용
      if (!file.type.startsWith("image/")) {
        setError("이미지 파일만 업로드 가능합니다.");
        return;
      }

      // 파일 크기 제한 (예: 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("파일 크기는 10MB 이하여야 합니다.");
        return;
      }

      setSelectedFile(file);
      setError(null);

      // 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setThumbnailPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCategoryToggle = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((name) => name !== categoryName)
        : [...prev, categoryName]
    );
  };

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

    if (!selectedFile) {
      setError("썸네일 이미지를 업로드해주세요.");
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
    
    // thumbnail은 파일로 전송
    formData.append("thumbnail", selectedFile);

    createMutation.mutate(formData);
  };

  const handleCancel = () => {
    navigate("/problemset");
  };

  return (
    <BasePage>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="border-b border-gray-200 pb-8 mb-8">
          <h1 className="font-headline text-3xl text-gray-900">문제집 생성</h1>
          <p className="mt-2 text-gray-500">
            새로운 문제집을 생성하세요.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Title Input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-sm font-medium text-gray-700">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="문제집 제목을 입력하세요"
              className="h-10 w-full rounded-md border border-gray-300 px-4 py-2 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          {/* Description Textarea */}
          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
              설명 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="문제집 설명을 입력하세요"
              rows={6}
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm transition-all focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
            />
          </div>

          {/* Categories Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              카테고리
            </label>
            <div className="flex flex-wrap gap-3">
              {categoryList?.map((category) => (
                <label
                  key={category.name}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.name)}
                    onChange={() => handleCategoryToggle(category.name)}
                    className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
            {categoryList && categoryList.length === 0 && (
              <p className="text-sm text-gray-500">카테고리가 없습니다.</p>
            )}
          </div>

          {/* Thumbnail Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              썸네일 이미지 <span className="text-red-500">*</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {thumbnailPreview ? (
              <div className="flex flex-col gap-3">
                <div className="relative w-full max-w-xs">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-full h-48 object-cover rounded-md border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={handleFileClick}
                >
                  다른 이미지 선택
                </Button>
              </div>
            ) : (
              <div
                onClick={handleFileClick}
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-primary-500 hover:bg-gray-50 transition-colors"
              >
                <svg
                  className="w-12 h-12 text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm text-gray-600 mb-1">
                  클릭하여 이미지를 업로드하세요
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG, GIF (최대 10MB)
                </p>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="default"
              size="md"
              onClick={handleCancel}
              disabled={createMutation.isPending}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "생성 중..." : "생성"}
            </Button>
          </div>
        </form>
      </div>
    </BasePage>
  );
}

