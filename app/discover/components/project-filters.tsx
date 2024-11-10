export function ProjectFilters() {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search projects..."
          className="h-9 w-[150px] lg:w-[250px]"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 w-[150px]">
              <Filter className="mr-2 h-4 w-4" />
              Category
              <ChevronDown className="ml-auto h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[150px]">
            <DropdownMenuCheckboxItem checked>All</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Technology</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Education</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Environment</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Community</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" className="h-9">
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Sort
        </Button>
        <Button variant="outline" size="sm" className="h-9">
          <LayoutGrid className="mr-2 h-4 w-4" />
          View
        </Button>
      </div>
    </div>
  )
} 