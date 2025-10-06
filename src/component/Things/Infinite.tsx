const Infinite = () => {
  return (
    <div>
      <p>
        <math>
          <mfrac>
            <mn>1</mn>
            <mn>3</mn>
          </mfrac>
        </math>
        <span className="pl-1">
        = 0.333...
        </span>
      </p>
      <p>0.333... * 3 = 0.999...</p>
      <p>
        <math>
          <mfrac>
            <mn>1</mn>
            <mn>3</mn>
          </mfrac>
        </math>
        <span className="pl-1">
          * 3 = 1
          </span>
        </p>
      <p>0.999... = 1 ?</p>
    </div>
  )
}

export default Infinite
