import LevelBadge from "../badge/LevelBadge";
import Button from "../button/Button";

const GroupTableItem = () => {
  return (
    <tr className="text-center border-b border-grayscale-default">
      <td className="px-6 py-3">1</td>
      <td className="px-6 py-3">
        <a href="#" className="flex text-primary-main gap-2">
          <img src="/icons/codeIconBlue.svg" />
          문제 제목
        </a>
      </td>
      <td className="px-6 py-3">
        <LevelBadge variant="red" titleText="Programmers" levelText="Lv.4" />
      </td>
      <td className="px-6 py-3">0명</td>
      <td className="px-6 py-3">0명</td>
      <td className="px-6 py-3">
        <div className="flex gap-2">
          <img src="/icons/viewsIcon.svg" />
          0명
        </div>
      </td>
      <td className="px-6 py-3">0/0명</td>
      <td className="px-6 py-3">0명</td>
      <td className="px-6 py-3">100%</td>
      <td className="px-6 py-3">
        <Button>버튼</Button>
      </td>
    </tr>
  );
};

export default GroupTableItem;
