import "./DebugPage.css";
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Input, Switch } from "../components/ui";
import { useState } from "react";

export default function DebugPage() {
  const [bSwitch, setbSwitch] = useState(false);
 
  return (
    <main className="debug-page">
      <Button>
        Button
      </Button>
      <Input label="label" helperText="1" placeholder="placeholder"/>

      <Card variant="default">
        <CardHeader>
          <CardTitle>Ranked Match</CardTitle>
          <CardDescription>Compete against other players for leaderboard points.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Current Rank: Gold II</p>
        </CardContent>
        <CardFooter>
          <Button variant="primary" size="sm">Play Now</Button>
        </CardFooter>
      </Card>

      <Switch checked={bSwitch} onCheckedChange={() => {setbSwitch(!bSwitch)}}>
        asdoias
      </Switch>

    </main>
  );
}