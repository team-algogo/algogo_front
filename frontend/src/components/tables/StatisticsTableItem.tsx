import StateBadge from "../badge/StateBadge";
import Button from "../button/Button";

const StatisticsTableItem = () => {
  return (
    <tr className="text-center border-b border-grayscale-default">
      <td className="px-6 py-3">1</td>
      <td className="px-6 py-3">
        <a href="#" className="block text-center text-primary-main">
          user
        </a>
      </td>
      <td className="px-6 py-3">
        <StateBadge isPassed={true} hasText={true} />
      </td>
      <td className="px-6 py-3">000000KB</td>
      <td className="px-6 py-3 text-alert-error">00ms</td>
      <td className="px-6 py-3">JAVA</td>
      <td className="px-6 py-3">11.29</td>
      <td className="px-6 py-3">
        <Button>버튼</Button>
      </td>
      <td className="px-6 py-3">
        <a href="#" className="flex gap-2 text-primary-main">
          <img src="/icons/reviewIcon.svg" />1
        </a>
      </td>
    </tr>
  );
};

export default StatisticsTableItem;
