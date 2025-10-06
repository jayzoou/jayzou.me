
import './TensesTable.css'

const TensesTable = () => {
  return (
    <table className="tenses-table m-auto my-4">
      <tr className="font-bold">
        <td className="w-20">状态/时间</td>
        <td className="">过去</td>
        <td className="">现在</td> 
        <td className="">将来</td>
        <td className="">过去将来</td>
      </tr>
      <tr className="">
        <td className="w-20">简单(一般)</td>
        <td className="">did</td>
        <td className="">do/does</td>
        <td className="">will do</td>
        <td className="">would do</td>
      </tr>
      <tr className="">
        <td className="w-20">进行</td>
        <td className="">was/were doing</td>
        <td className="">am/is/are doing</td>
        <td className="">will be doing</td>
        <td className="">would be doing</td>
      </tr>
      <tr className="">
        <td className="w-20">完成</td>
        <td className="">had done</td>
        <td className="">have/has done</td>
        <td className="">will have done</td>
        <td className="">would have done</td>
      </tr>
      <tr className="">
        <td className="w-20">完成进行</td>
        <td className="">had been doing</td>
        <td className="">have/gas been doing</td>
        <td className="">will have been doing</td>
        <td className="">would have been doing</td>
      </tr>
    </table>
  )
}

export default TensesTable
