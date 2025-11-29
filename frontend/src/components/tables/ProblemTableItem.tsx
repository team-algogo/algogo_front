import LevelBadge from "../badge/LevelBadge";
import Button from "../button/Button";

const ProblemTableItem = () => {
    return (
        <tr className="text-center border-b border-grayscale-default">
            <td className="px-6 py-3">1</td>
            <td className="px-6 py-3">
                <a href="#" className="flex gap-1"><img src="/icons/codeIconBlack.svg"/>문제 제목</a>
            </td>
            <td className="px-6 py-3">
                <LevelBadge variant="orange" titleText="BOJ" levelText="G4"/>
            </td>
            <td className="px-6 py-3">0명</td>
            <td className="px-6 py-3">
                <div className="flex gap-1">
                <img src="/icons/viewsIcon.svg" />0명
                </div>
            </td>
            <td className="px-6 py-3">0명</td>
            <td className="px-6 py-3">100%</td>
            <td className="px-6 py-3"><Button>제출</Button></td>
        </tr>
    )
}

export default ProblemTableItem;