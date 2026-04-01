import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";


export function Searchbar() {
    return (
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
            <Input placeholder="Search" />
            <Button variant="outline" size="icon" aria-label="Submit">
            </Button>
        </div>
    )
}