type AddProps = {
    a: number,
    b: number,
}

function Add({a,b}: AddProps){
    return <div>{a+b}</div>;
}
function Mul({a,b}: AddProps){
    return <div>{a**b}</div>;
}

export {Add, Mul};