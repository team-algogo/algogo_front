import { useEffect, useState } from "react";
import StateBadge from "@components/badge/StateBadge";
import Button from "@components/button/Button";
import SearchInput from "@components/form/input/SearchInput";
import { Editor } from "@monaco-editor/react";
import BasePage from "@pages/BasePage";
import { useParams } from "react-router-dom";
import {
  getProblemInfo,
  postCodeSubmit,
  type ProgramProblemProps,
} from "@api/code/codeSubmit";

const CodeSubmitPage = () => {
  const param = useParams();

  const [code, setCode] = useState("// 풀이한 코드를 작성해주세요");
  const [algorithmList, setAlgorithmList] = useState<
    { id: number; name: string }[]
  >([]);
  const [problemInfo, setProblemInfo] = useState<ProgramProblemProps | null>(
    null,
  );
  const [isSuccess, setIsSuccess] = useState(true);
  const [execTime, setExecTime] = useState("");
  const [memory, setMemory] = useState("");
  const [strategy, setStrategy] = useState("");
  const [language, setLanguage] = useState("java");

  const [isDisabled, setIsDisabled] = useState(true);

  const getProblem = async (id: string) => {
    try {
      const response = await getProblemInfo(id);
      setProblemInfo(response);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (language === "python") {
      setCode((prev) => prev.replaceAll("//", "#"));
    } else {
      setCode((prev) => prev.replaceAll("#", "//"));
    }
  }, [language]);

  useEffect(() => {
    if (execTime != "" && memory != "" && strategy != "") setIsDisabled(false);
    else setIsDisabled(true);
  }, [execTime, memory, strategy]);

  const handleSubmit = async () => {
    if (!problemInfo) return;
    console.log(problemInfo);
    try {
      const response = await postCodeSubmit(
        Number(param.programProblemId),
        language,
        code,
        strategy,
        Number(execTime),
        Number(memory),
        isSuccess,
        algorithmList.map((value) => value.id),
      );

      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!param.programProblemId) return;
    getProblem(param.programProblemId);
  }, [param]);

  return (
    <BasePage>
      <div className="flex flex-col gap-2 py-8">
        {/* Title Section */}
        <div className="flex">
          <div className="text-grayscale-warm-gray mr-2 flex items-end">
            {problemInfo?.problemNo}.
          </div>
          <a
            target="_blank"
            href={problemInfo?.problemLink}
            className="font-headline text-primary-main text-3xl font-bold"
          >
            {problemInfo?.title}
          </a>
        </div>

        {/* Main Content Two Columns */}
        <div className="flex items-start gap-8">
          {/* Left Column: Code Editor */}
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex items-center justify-end">
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                }}
                className="border-grayscale-warm-gray rounded-lg border px-2 py-1 text-sm outline-none"
              >
                <option value="java">Java</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
              </select>
            </div>

            <div className="flex h-[600px] flex-col overflow-hidden rounded-md">
              <div className="bg-[#F3F4F6] px-4 py-2 text-sm font-medium">
                Write
              </div>
              <Editor
                height="100%"
                language={language}
                value={code}
                onChange={(val) => setCode(val || "")}
                theme="light"
                options={{
                  fontSize: 15,
                  minimap: { enabled: false },
                  scrollbar: {
                    vertical: "auto",
                    horizontal: "auto",
                  },
                  padding: { top: 16 },
                }}
                className="border-transparent"
              />
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="flex w-[400px] flex-col gap-6">
            {/* Radio Buttons */}
            <div className="flex h-8 items-center justify-end gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="isSuccess"
                  checked={!isSuccess}
                  onChange={() => setIsSuccess(false)}
                  className="accent-alert-error h-4 w-4 cursor-pointer"
                />
                <StateBadge hasText={true} isPassed={false} />
              </label>
              <label className="inline-flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="isSuccess"
                  checked={isSuccess}
                  onChange={() => setIsSuccess(true)}
                  className="accent-primary-300 h-4 w-4 cursor-pointer"
                />
                <StateBadge hasText={true} isPassed={true} />
              </label>
            </div>

            {/* Algorithm Search */}
            <div className="flex flex-col gap-2">
              <SearchInput
                selectedItems={algorithmList}
                onItemsChange={setAlgorithmList}
                className="w-full"
              />
            </div>

            {/* Time & Memory */}
            <div className="flex gap-4">
              <div className="flex flex-1 flex-col gap-2">
                <label className="text-sm font-medium">실행 시간(ms)</label>
                <input
                  type="number"
                  value={execTime}
                  onChange={(e) => setExecTime(e.target.value)}
                  placeholder="예: 52"
                  className="border-grayscale-warm-gray focus:border-primary-main caret-primary-main w-full rounded-md border-2 px-3 py-2 outline-none"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <label className="text-sm font-medium">메모리(KB)</label>
                <input
                  type="number"
                  value={memory}
                  onChange={(e) => setMemory(e.target.value)}
                  placeholder="예: 32412"
                  className="border-grayscale-warm-gray focus:border-primary-main caret-primary-main w-full rounded-md border-2 px-3 py-2 outline-none"
                />
              </div>
            </div>

            {/* strategy */}
            <div className="flex h-full flex-col gap-2">
              <label className="text-sm font-medium">문제 접근 방식</label>
              <textarea
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                placeholder="문제를 어떻게 접근했는지 작성해주세요!"
                className="border-grayscale-warm-gray focus:border-primary-main caret-primary-main h-[300px] w-full resize-none rounded-lg border-2 px-4 py-4 outline-none"
              />
            </div>

            {/* Submit Button */}
            <Button disabled={isDisabled} onClick={handleSubmit}>
              제출하기
            </Button>
          </div>
        </div>
      </div>
    </BasePage>
  );
};

export default CodeSubmitPage;
